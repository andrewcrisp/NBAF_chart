function SelectFields(arr) {
    var temparray = []
    arr.forEach(function(item){
        //temp = {
        //    ID: item['DeptID'],
        //    Position: item['Position'],
        //    DeptID: item['DeptID'],
        //    name: item['Name'],
        //    PDNumber: item['Master Record #'],
        //    Title: item['Job Title'],
        //    ReportsTo: item['Reports To'],
        //    PayCode: item['Pay Plan'] + '-' + item['Occ Series'] + '-' + item['Grade'],
		//	children: []
        //}
		temp = new Position(item)
        temparray.push(temp)
        //console.log(item['Job Title'])
    })
    return temparray
}

class Position{
	constructor(item) {
        this.ID = item['DeptID'],
        this.Position = item['Position'],
        this.DeptID = item['DeptID'],
        this.name = item['Name'],
        this.PDNumber = item['Master Record #'],
        this.Title = item['Job Title'],
        this.ReportsTo = item['Reports To'],
        this.PayCode = item['Pay Plan'] + '-' + item['Occ Series'] + '-' + item['Grade'],
        this.children = []
	    this.AddChildren = function(arr){
			this.children = arr.filter(i => i['ReportsTo'] == this.Position)
			if(this.children.length > 0){
				this.children.forEach(c => c.AddChildren(arr))
			}
	    }
		this.nodeContent = this.Title + '\n' + this.PDNumber + '\n' + this.PayCode
	}
}

function GetParents(arr) {
    var parents = arr.map(function(d) { return d['ReportsTo']; });
	
	var unique = parents.filter(onlyUnique);
	parents = arr.filter(i => unique.includes(i['Position']))
	return parents
}

function GetHighestParents(arr) {
	var parents = GetParents(arr)
	var grandparents = GetParents(parents)
	while (grandparents.length > 0) {
		console.log(parents.length)
		parents = grandparents
		grandparents = GetParents(parents)
	}
	return parents
}

function BuildNestedArray(arr) {
    var ancestors = GetHighestParents(arr)
    ancestors.forEach(a => a.AddChildren(arr))
    return ancestors
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var nodeTemplate = function(data) {
  return `
	<span class="office">${data.DeptID}</span>
	<div class="title">${data.name}</div>
	<div class="content">
		${data.Title}
		<br />${data.PDNumber}
		<br />${data.PayCode}
	</div>
  `;
};


var process_wb = (function() {
	var OUT = document.getElementById('out');
	var HTMLOUT = document.getElementById('htmlout');

	var get_format = (function() {
		var radios = document.getElementsByName( "format" );
		return function() {
			for(var i = 0; i < radios.length; ++i) if(radios[i].checked || radios.length === 1) return radios[i].value;
		};
	})();

	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
	};

	var to_csv = function to_csv(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(csv.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		});
		return result.join("\n");
	};

	var to_fmla = function to_fmla(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
			if(formulae.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(formulae.join("\n"));
			}
		});
		return result.join("\n");
	};

	var to_html = function to_html(workbook) {
		HTMLOUT.innerHTML = "";
		workbook.SheetNames.forEach(function(sheetName) {
			var htmlstr = XLSX.write(workbook, {sheet:sheetName, type:'string', bookType:'html'});
			HTMLOUT.innerHTML += htmlstr;
		});
		return "";
	};

	var to_xlsx = function to_xlsx(workbook) {
		HTMLOUT.innerHTML = "";
		XLSX.writeFile(workbook, "SheetJSTest.xlsx");
		return "";
	};

	return function process_wb(wb) {
		global_wb = wb;
		var output = "";
		switch(get_format()) {
			case "form": output = to_fmla(wb); break;
			case "html": output = to_html(wb); break;
			case "json": output = to_json(wb); break;
			case "xlsx": output = to_xlsx(wb); break;
			default: output = to_csv(wb);
		}
		if(OUT.innerText === undefined) OUT.textContent = output;
		else OUT.innerText = output;
		if(typeof console !== 'undefined') console.log("output", new Date());
	};
})();