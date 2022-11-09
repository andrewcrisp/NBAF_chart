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
