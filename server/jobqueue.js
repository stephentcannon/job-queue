Jobqueue = new Meteor.Collection('jobqueue');

Jobqueue.add = function(job){
  if(!job.name || !job.object || !job.method){
    throw 'Invalid job';
  }
  job.state = 'unprocessed';
  Jobqueue.insert(job);
};

// Jobqueue.remove = function(job_id){
//   console.log('Jobqueue.remove fired for job_id: ' + job_id);
//   Jobqueue.remove({_id: job_id});
// }

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
        global[job.object][job.method](job, function(job_id){
          Jobqueue.remove(job_id);
        });
      }
    });
  }catch(error){
    console.log('Jobqueue error: ' + JSON.stringify(error) );
  }
};



