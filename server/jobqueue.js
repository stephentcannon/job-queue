
Jobqueue.add = function(job){
  if(!job.name || !job.object || !job.method){
    throw 'Invalid job';
  }
  
  job.createdAt = new Date();
  job.state = 'unprocessed';
  Jobqueue.insert(job);
};

Jobqueue.schedule = function(job){
  if(!job.name || !job.object || !job.method || !job.when){
    throw 'Invalid job';
  }
  job.createdAt = new Date();
  job.state = 'scheduled';
  Jobqueue.insert(job);
};

Jobqueue.reschedule = function(job, milliseconds){
  // console.log('Jobqueue.reschedule');
  // console.log('job');
  // console.log(job);
  // console.log('Jobqueue.reschedule milliseconds: ' + milliseconds);
  if(isNaN(milliseconds) || milliseconds <= 1000){
   throw 'Invalid milliseconds' ;
  } else {
    var x = new Date();
    x.setMilliseconds(x.getMilliseconds() + milliseconds);
    delete job._id;
    delete job.createdAt;
    job.when = x;
    // console.log('rescheduling this job via Jobqueue.schedule');
    // console.log(job);
    Jobqueue.schedule(job);
  }
}

Jobqueueprocessor = function (name, interval) {
 
  if(interval){
    if(isNaN(interval) || interval <= 1000){
      throw 'Invalid interval';
    } else {
      Jobqueueprocessor.schedulerInterval = interval;
    }
  } else {
    Jobqueueprocessor.schedulerInterval = 60000;
  }
  
  var jobqueue_query = Jobqueue.find({name: name, state: 'unprocessed'});

  var jobqueue_handle = jobqueue_query.observe({
    added: function (item, beforeIndex) {
      Jobqueueprocessor.process(item);
    },
  });
  
  Meteor.setInterval(function(){
    try{
      // console.log('Jobqueueprocessor setInterval ran');
      // console.log('name: ' + name);
      // console.log('Jobqueueprocessor.schedulerInterval: ' + Jobqueueprocessor.schedulerInterval);
      //query.createdAt = { $gte: new Date(options.start_date), $lte: new Date(options.end_date) }
      Jobqueue.find({name: name, state: 'scheduled', when: { $lte: new Date() }}).forEach(function(job){
        Jobqueueprocessor.process(job);
      });
    }catch(error){
      console.log('Jobqueueprocessor scheduler error: ' + JSON.stringify(error) );
    }
  }, Jobqueueprocessor.schedulerInterval);
  

};

Jobqueueprocessor.process = function(job){
  try{
    Jobqueue.update({_id: job._id}, {$set: {state: 'processed'}}, function(error){
      if(error){
        console.log('Jobqueueprocessor.process error: ' + error);
      } else {
        try{
          global[job.object][job.method](job, function(job_id){
            Jobqueue.remove(job_id);
          });
        }catch(error){
          console.log('Jobqueueprocessor.process catch error inside update ' + error);
        }
      }
    });
  }catch(error){
    console.log('Jobqueue catch error: ' + JSON.stringify(error) );
  }
};

Meteor.publish("jobqueue", function(options) {
  // console.log('***********[jobqueue.js] **************');
  // console.log('[jobqueue.js] options');
  // console.log(options);
  // console.log('[jobqueue.js] start_date: ');
  // console.log( options.start_date );
  // console.log('[jobqueue.js] new Date(start_date) works: ' + new Date(options.start_date) );
  // console.log('[jobqueue.js] end_date: ' + options.end_date );
  // console.log('[jobqueue.js] new Date(end_date) works: ' + new Date(options.end_date) );
  try{
    if(this.userId){
      if(Meteor.users.findOne({_id: this.userId}).admin){
        var query= {};
        
        if(options.start_date && options.end_date){
          
          Jobqueue.validateDates(options.start_date, options.end_date);
          
          query.createdAt = { $gte: new Date(options.start_date), $lte: new Date(options.end_date) };
          
        }
          
        if(options.searchParams){
          if(options.searchParams.state){
            query.state = options.searchParams.state;
          }
          if(options.searchParams.name){
            query.name = options.searchParams.name;
          }
          if(options.searchParams.object){
            query.object = options.searchParams.object;
          }
          if(options.searchParams.method){
            query.method = options.searchParams.method;
          }
        }
          
        return Jobqueue.find(query);
      }
    }
  }catch(error){
     //throw new Meteor.Error(600, 'Server error: ' + error);
     console.log(error);
     return null;
  }
});

Jobqueue.allow({
  remove: function (userId, doc) {
    // console.log('Loggins.remove')
    // console.log(userId);
    if(userId){
      if(Meteor.users.findOne({_id: userId}).admin){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    
  }
});

Meteor.methods({
  purgeJobqueue: function (options) {

    this.unblock();
    if(this.userId){
      if(Meteor.users.findOne({_id: this.userId}).admin){
        var query= {};
        
        if(options.start_date && options.end_date){
          
          Jobqueue.validateDates(options.start_date, options.end_date);
          
          query.createdAt = { $gte: new Date(options.start_date), $lte: new Date(options.end_date) };
          
        }
          
        
        if(options.state){
          query.state = options.state;
        }
        if(options.name){
          query.name = options.name;
        }
        if(options.object){
          query.object = options.object;
        }
        if(options.method){
          query.method = options.method;
        }

        Jobqueue.remove(query, function(error){
          if(error){
            console.log(error);
            throw error;
          }
        });
      }
    }
  },
});

