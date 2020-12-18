import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  addBudgetForm: FormGroup;
  nameInput = "";
  valueInput = "";
  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //ch
    this.http.get('http://161.35.59.8:3000/api/dashboard')
    .subscribe((res: any) => {
      console.log(res);
    for(var i = 0; i < res.budget.length; i++) {
        let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
        this.dataSource.datasets[0].data[i] = res.budget[i].budget;
        this.dataSource.datasets[0].backgroundColor[i] = color;
        this.dataSource.labels[i] = res.budget[i].title;
    }
    this.createChart();
    this.createNut();
    this.createLine();

  });

    console.log("init");
  }

  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [],
        }
    ],
    labels: []
  };

  myPieChart;
  myDoughChart;
  myPolarChart;

  createChart() {
    var ctx = document.getElementById("myChart");
    this.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        title: {
          display:true,
          text: 'Budget Chart'
        }
        }
    });
}

createNut() {
  var ctx = document.getElementById("nut");
  this.myDoughChart = new Chart(ctx, {
      type: 'doughnut',
      data: this.dataSource,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          }
      },
      title: {
        display:true,
        text: 'Doughnut Chart'
      }
      }
  });
}

createLine() {
  var ctx = document.getElementById("line");
  this.myPolarChart = new Chart(ctx, {
      type: 'polarArea',
      data: this.dataSource,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          }
      },
      title: {
        display:true,
        text: 'Polar Chart'
      }
      }
  });
}
addData(chart, label,data) {
  chart.dataSource.labels.push(label);
  chart.dataSource[0].data.push(data);
  chart.update();
}


  addBudget() {


    const budgetInfo = {
      title: this.nameInput,
      budget: this.valueInput
    };

    //ch
    console.log(budgetInfo);
    this.http.post('http://161.35.59.8:3000/api/dashboard', budgetInfo)
    .subscribe((res: any) => {
      console.log('test');
      console.log(res);
      if (res) {
        console.log('added');
        this.nameInput = "";
        this.valueInput = "";
        //ch
        this.http.get('http://161.35.59.8:3000/api/dashboard')
        .subscribe((res: any) => {
          console.log(res);
        for(var i = 0; i < res.budget.length; i++) {
            let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
            this.dataSource.datasets[0].data[i] = res.budget[i].budget;
            this.dataSource.datasets[0].backgroundColor[i] = color;
            this.dataSource.labels[i] = res.budget[i].title;
        }
        this.myPieChart.update();
        this.myDoughChart.update();
        this.myPolarChart.update();

      });
      }
    }, (error: any) => {
      console.log(error);
    });

  }



}
