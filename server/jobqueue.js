Jobqueue = new Meteor.Collection('jobqueue');

var jobqueue_handle = jobqueue_query.observe({
  added: function (item, beforeIndex) {
    JobQueue.process(item);
  },
});

Jobqueue.process = function(item){
  try{
    Jobqueue.update({_id: item._id}, {$set: {status: 'processing'}}, function(error){
      if(error){
        console.log('Jobqueue error: ' + error);
      } else {
        global[item.type]['process'](item);
      }
    });
  }catch(error){
    console.log('Jobqueue error: ' + JSON.stringify(error) );
  }
}

Jobqueue.addJob = function(job){
  job.status = 'unprocessed';
  Jobqueue.insert(job);
}

