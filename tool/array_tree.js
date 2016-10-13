var data = [
   {
      "name":"root",
      "_id":"root_id",
   },
   {
      "name":"a1",
      "parentAreaRef":{
         "id":"root_id",
      },
      "_id":"a1_id",
   },
   {
      "name":"a2",
      "parentAreaRef":{
         "id":"a1_id",
      },
      "_id":"a2_id",
   },
   {
      "name":"a3",
      "parentAreaRef":{
         "id":"a2_id",
      },
      "_id":"a3_id",
   },
   {
      "name":"b1",
      "parentAreaRef":{
         "id":"root_id",
      },
      "_id":"b1_id",
   },
   {
      "name":"b2",
      "parentAreaRef":{
         "id":"b1_id",
      },
      "_id":"b2_id",
   },
   {
      "name":"b3",
      "parentAreaRef":{
         "id":"b1_id",
      },
      "_id":"b3_id",
   }
];

var idToNodeMap = {};
var root = null;
for(var i = 0; i < data.length; i++) {
    var datum = data[i];
    datum.children = [];
    idToNodeMap[datum._id] = datum;

    if(typeof datum.parentAreaRef === "undefined") {
        root = datum;
    } else {
        var parentNode = idToNodeMap[datum.parentAreaRef.id];
        parentNode.children.push(datum);
        console.log('\n');
        console.log('<<<<< '+i+':datum >>>>>');
        console.log(datum,'utf8',4);
        console.log('<<<<< '+i+':idToNodeMap >>>>>');
        console.log(JSON.stringify(idToNodeMap,'utf8',4));
        console.log(JSON.stringify(idToNodeMap[datum._id],'utf8',4));
        console.log('<<<<< '+i+':parentNode >>>>>');
        console.log(JSON.stringify(parentNode,'utf8',4));
        console.log(JSON.stringify(parentNode.children,'utf8',4));
        console.log('\n');
    }
}


console.log(JSON.stringify(root,'utf8',4));
