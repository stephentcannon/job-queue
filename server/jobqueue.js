Jobqueue = new Meteor.Collection('jobqueue');

Jobqueue.addJob = function(job){
  job.status = 'unprocessed';
  Jobqueue.insert(job);
}




