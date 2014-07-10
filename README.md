jobqueue
========

usage
=====
* link git repo to apps smart.json

* mrt add jobqueue

* Start processing jobs
  var myjobprocessor = new Jobqueueprocessor(name);

* Add a job
  Jobqueue.add({
    name: [name of queue for a processor],
    object: Object,
    method: method on object,
    user_id: theUserId,
  });

* Remove a job
  Jobqueue.removeJob(job._id);

* Process a job
  Object.method(job, callback)
  
  // do something
  
  callback(job._id); // to destroy job when done or use Jobqueue.remove

* Job states
  unprocessed == waiting for a queue processor to process it
  processed == processed must be removed




