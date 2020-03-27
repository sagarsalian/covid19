<%-- 
    Document   : index
    Created on : Mar 26, 2020, 7:36:32 PM
    Author     : paromita
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>COVID19 Dashboard India</title>

        <link rel="apple-touch-icon" sizes="180x180" href="./img/favicon_package/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="./img/favicon_package/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="./img/favicon_package/favicon-16x16.png">
        <link rel="manifest" href="./img/favicon_package/site.webmanifest">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <link rel="stylesheet" href="./css/thirdparty/bootstrap.min.css">
    </head>
    <body>
        <h1 style="text-align: center">Displaying Results</h1>
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <canvas id="myChart" ></canvas>
                </div>
                <div class="col-6">
                    <h2>new graphs...</h2>
                </div>

            </div>
        </div>



        <script src="./scripts/thirdparty/bootstrap.min.js" ></script>
        <script src="./scripts/thirdparty/chart.min.js"></script>
        <script src="./scripts/thirdparty/jquery-3.4.1.slim.min.js"></script>
        <script src="./scripts/thirdparty/popper.min.js"></script>


        <script>
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                },
                options: {
                    scales: {
                        yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                    }
                }
            });
        </script>
    </body>
</html>
