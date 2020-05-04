const salaryFilter = [
  { message: 'Up to 400£ per day', jobType:'Contract', lowerLimit: 0, upperLimit: 400, index: "0"},
  { message: '400£ - 500£ per day', jobType:'Contract', lowerLimit: 400, upperLimit: 500, index: "1" },
  { message: '500£ - 600£ per day', jobType:'Contract', lowerLimit: 500, upperLimit: 600, index: "2" },
  { message: 'Over 600£ per day', jobType:'Contract', lowerLimit: 600, upperLimit: Infinity, index: "3" },
  { message: 'Under 35000£ monthly', jobType:'Permanent', lowerLimit: 0, upperLimit: 35000, index: "4" },
  { message: '35000£ - 50000£ monthly', jobType:'Permanent', lowerLimit: 35000, upperLimit: 50000, index: "5" },
  { message: '50000£ - 75000£ monthly', jobType:'Permanent', lowerLimit: 50000, upperLimit: 75000, index: "6" },
  { message: '75000£ - 100000£ monthly', jobType:'Permanent', lowerLimit: 75000, upperLimit: 100000, index: "7" },
  { message: '100000£ - 150000£ monthly', jobType:'Permanent', lowerLimit: 100000, upperLimit: 150000, index: "8" },
  { message: 'Over 150000£ monthly', jobType:'Permanent', lowerLimit: 150000, upperLimit: Infinity, index: "9" },
];

export default salaryFilter;
