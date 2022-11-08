var ExcelToJSON = function() {

    this.parseExcel = function(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          console.log(JSON.parse(json_object));
          return json_object
        })
      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
  };
  
function convert(arr) {
    return $.map(unique(arr), function(name){
        return {
            name: name,
            details: $.grep(arr, function(item){
                return item['Reports To'] == name
            })
        } 
    });
}

function unique(arr) {
    var result = [];
    $.map(arr, function(item){
        if ($.inArray(item['Reports To'], result))
            result.push(item['Reports To']);
    })
    return result;
}