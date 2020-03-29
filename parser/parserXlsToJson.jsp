<%-- 
    Document   : uploadXls
    Created on : Mar 29, 2020, 6:25:36 PM
    Author     : Sagar
    Note       : Run this File and upload Xls to get Json Data , its a javacript based parser.  
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>XLS Parser</title>
    </head>
    <body>
        <center>
        <h1>JavaScript XLS Parser</h1>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        <script type="text/javascript" src="https://github.com/douglascrockford/JSON-js/raw/master/json2.js"></script>

        <script>
            function ConvertToCSV(objArray) {
                var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
                var str = '';

                for (var i = 0; i < array.length; i++) {
                var line = '';
                    for (var index in array[i]) {
                        if (line != '') line += ','

                        line += array[i][index];
                    }

                    str += line + '\r\n';
                }

                return str;
            }
            var ExcelToJSON = function () {

                this.parseExcel = function (file) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object
                            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            var json_object = JSON.stringify(XL_row_object);
                            console.log(JSON.parse(json_object));
                            jQuery('#xlx_json').val(json_object);
                            
                            // Convert Object to JSON
                            //var jsonObject = JSON.stringify(json_object);
                            // Convert JSON to CSV & Display CSV
                            // alert(ConvertToCSV(jsonObject));
                            jQuery('#csv').val("district,state,confirmed,recovered,death"+"\n" + ConvertToCSV(json_object));
                        });
                    };

                    reader.onerror = function (ex) {
                        console.log(ex);
                    };

                    reader.readAsBinaryString(file);
                };
            };

            function handleFileSelect(evt) {

                var files = evt.target.files; // FileList object
                var xl2json = new ExcelToJSON();
                xl2json.parseExcel(files[0]);
            }



        </script>
        <form enctype="multipart/form-data">
            <input id="upload" type=file  name="files[]">
        </form>

        <textarea class="form-control" rows=35 cols=120 id="xlx_json"></textarea>
        
        <h1 style=""> CSV </h1>
        <textarea class="form-control" rows=35 cols=120 id="csv"></textarea>

        <script>
            document.getElementById('upload').addEventListener('change', handleFileSelect, false);

        </script>
        
        </center>
    </body>
</html>
