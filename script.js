document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('barChart').getContext('2d');

    // Parse CSV data and create chart
    function parseCSVAndCreateChart(csvData) {
        const lines = csvData.split('\n');
        const movieReviewsData = [];

        // Parse CSV lines
        for (let i = 1; i < lines.length; i++) {
            const [title, year, rating] = lines[i].split(',');
            movieReviewsData.push({ title, year, rating: parseFloat(rating) });
        }

        createChart(movieReviewsData);
    }

    // Fetch CSV data
    fetch('movie_reviews.csv')
        .then(response => response.text())
        .then(parseCSVAndCreateChart)
        .catch(error => console.error('Error fetching CSV:', error));

    // Create chart
    function createChart(movieReviewsData) {
        const years = ['All', ...new Set(movieReviewsData.map(movie => movie.year))];
        const yearSelect = document.getElementById('yearSelect');

        // Populate year filter select options
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        const colorSelect = document.getElementById('colorSelect');

        // Function to update chart
        function updateChart(yearFilter, color) {
            let filteredData = movieReviewsData;
            if (yearFilter !== 'All') {
                filteredData = movieReviewsData.filter(movie => movie.year === yearFilter);
            }

            const labels = filteredData.map(movie => movie.title);
            const ratings = filteredData.map(movie => movie.rating);

            // Update chart data
            barChart.data.labels = labels;
            barChart.data.datasets[0].data = ratings;
            barChart.data.datasets[0].backgroundColor = color;

            // Update chart
            barChart.update();
        }

        // Event listeners for controls
        yearSelect.addEventListener('change', function(event) {
            const selectedYear = event.target.value;
            const color = colorSelect.value;
            updateChart(selectedYear, color);
        });

        colorSelect.addEventListener('input', function(event) {
            const selectedYear = yearSelect.value;
            const color = event.target.value;
            updateChart(selectedYear, color);
        });

        // Initialize chart
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Movie Ratings',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Default color
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Initial chart update with all data
        updateChart('All', 'rgba(54, 162, 235, 0.5)');
    }
});
