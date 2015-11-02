// Generate an array of numVals linearly spaced
// values from lowBound to upBound.
function linspace(lowBound,upBound,numVals)
{
	if(!validator.isInt(numVals,{min:2}))
	{
		console.log("ERROR: numVals must be an integer >= 2.");
		return "ERROR: numVals must be an integer >= 2.";
	}
	else
	{
		var array = [];
		var step = ((upBound-lowBound)/(numVals-1));
		for(var i = 0; i < numVals; i++)
		{
			array[i] = (lowBound + (i*step));
		}
		return array;
	}
}