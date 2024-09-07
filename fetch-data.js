function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data fetched successfully!');
    }, 2000);
  });
}

async function getData() {
  console.log('Fetching data...');
  const result = await fetchData();
  console.log(result);
}

getData();
