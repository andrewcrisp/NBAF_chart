function SelectFields(arr) {
var temparray = []
arr.forEach(function(item){
	temp = {
		ID: item['DeptID'],
		Position: item['Position'],
		DeptID: item['DeptID'],
		Name: item['Name'],
		PDNumber: item['Master Record #'],
		Title: item['Job Title'],
		ReportsTo: item['Reports To'],
		PayCode: item['Pay Plan'] + '-' + item['Occ Series'] + '-' + item['Grade']
	}
	temparray.push(temp)
	//console.log(item['Job Title'])
})
return temparray
}