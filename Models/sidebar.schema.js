const mongoose = require("mongoose");
const SidebarSchema = new mongoose.Schema({
  
  module_name: String,
  module_access:String,
  link:String,
  sub_module: Array(Object),
  access_item:Array(Object)
});

module.exports = mongoose.model("Sidebar", SidebarSchema, "Sidebar");
