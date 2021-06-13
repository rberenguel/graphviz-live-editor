export {example};

const example = `
digraph G {
  margin=0.5; // either one (all) or two (hor,vert) numbers, in inches
  bgcolor="#ffffff00" // rgba in hex format
  rankdir=LR // other options would be RL, TB, BT
  compound=true // this enables logical arrow heads
  fontname="monoidregular" // should be a valid webfont
  node [
    // General rules for _all_ nodes
    label="" // Default label empty
    fontname=monoidregular // Quotes are not mandatory 
    labelloc=c // vert. centred labels
    margin="0.3,0.15" // side and top margin for text in nodes
    splines=true // allows curved arrows
    shape=rect
    style=rounded
    ];
  edge [
    minlen=2
  ];
  
  air[ // if you define nodes ahead of time you can add properties
      label="Airflow"
      group=g  
      // nodes in a group are aligned (direction depending on rank
    ]
  
  subgraph cluster_storage { 
    // if the id starts with cluster, it will have a box and label
    margin=19 // subgraph inherits margin from graph, bad
    style="filled,rounded,dotted"; // example of styles
    fillcolor="#00000012" // transparency stacks
    subgraph cluster_redshift {
     // Layout for nodes with images does not match when running
     // using the dot CLI, so wrap in a cluster
     label="Redshift"
     red[
      label=""
      // Images need to be made available to the graphviz object
      // I have provided a few
      image="i/aws/Amazon-Redshift.png"
      style=""
     ]
    }
    dat[label="Databricks"
      shape="cylinder"
      // https://graphviz.org/doc/info/shapes.html#polygon
      style=filled,
      fillcolor="#00ff0050"
      group=g
    ]
  }
  subgraph cluster_S3 {
    margin="" label=S3 style="filled,rounded,dotted" 
    fillcolor="#00000012"
    S3[style="" image="i/aws/Amazon-Simple-Storage-Service.png"]
  } 
  // could be a oneliner
  mail[
    image="i/fa/solid/envelope.png"
    style=""
    shape=none
  ]
  air -> mail
  air -> red [lhead=cluster_redshift] 
  // logical head of the arrow is outside the cluster
  air -> dat [lhead=cluster_storage]
  dat -> S3 [lhead=cluster_S3]
}`