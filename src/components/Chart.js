import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const Chart = ({ data }) => {
  const html = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          canvas { width: 100% !important; height: 100% !important; }
        </style>
      </head>
      <body>
        <canvas id="myChart"></canvas>
        <script>
          const ctx = document.getElementById('myChart').getContext('2d');
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(data.map(item => item.x))},
              datasets: [{
                label: 'Power (W)',
                data: ${JSON.stringify(data.map(item => item.y))},
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scalesPageToFit={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
});

export default Chart;