[plugin name="change_layer_order"]

[l]
[iscript]
console.log("content: free; order: 2, 1, 0;");
[endscript]
[change_layer_order content="free" order="2,1,0"]

[l]
[iscript]
console.log("content: free; order: 1, 2, 0;");
[endscript]
[change_layer_order content="free" order="1,2,0"]

[l]
[iscript]
console.log("content: message; order: 1, 0;");
[endscript]
[change_layer_order content="message" order="1,0"]

[l]
[iscript]
console.log("content: free; order: 0, 1, 2;");
[endscript]
[change_layer_order content="free" order="0,1,2"]

[l]
[iscript]
console.log("content: message; order: 0, 1;");
[endscript]
[change_layer_order content="message" order="0,1"]

[s]