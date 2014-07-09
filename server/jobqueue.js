Jobqueue = new Meteor.Collection('jobqueue');

Jobqueue.addJob = function(job){
  console.log('Jobqueue.addJob fired with job');
  console.log(job);
  job.status = 'unprocessed';
  Jobqueue.insert(job);
};

Jobqueue.removeJob = function(job_id){
  Jobqueue.remove({_id: job_id});
}





