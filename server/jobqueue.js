Jobqueue = new Meteor.Collection('jobqueue');

Jobqueue.add = function(job){
  if(!job.name || !job.object || !job.method){
    throw 'Invalid job';
  }
  
  job.createdAt = new Date();
  job.state = 'unprocessed';
  Jobqueue.insert(job);
};

Jobqueueprocessor = function (name) {
  var jobqueue_query = Jobqueue.find({name: name, state: 'unprocessed'});

  var jobqueue_handle = jobqueue_query.observe({
    added: function (item, beforeIndex) {
      Jobqueueprocessor.process(item);
    },
  });
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



