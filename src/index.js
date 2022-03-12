import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Cov2 from './cov2.js'
// import App from './App'
import map_yamaguchi from './Map'
import reportWebVitals from './reportWebVitals'

// Fast Design
import {
  provideFASTDesignSystem,
  fastCard,
  fastTreeItem,
  fastTreeView
} from "@microsoft/fast-components";
provideFASTDesignSystem()
  .register(
    fastCard(),
    fastTreeItem(),
    fastTreeView()
  );

const cov = new Cov2()
cov.prefecture = "山口県"
cov.img_pref = map_yamaguchi()
// 更新日時
cov.datetime = "2021-01-01"
// 過去 30 日間の発生状況
cov.map_date_range = 30

ReactDOM.render(cov.news(), document.getElementById("news"))
ReactDOM.render(cov.title(), document.getElementById("page-title"))
ReactDOM.render(cov.map(), document.getElementById("pref-map"))
ReactDOM.render(cov.graph(), document.getElementById("graph"))
ReactDOM.render(cov.posis30(), document.getElementById("posis30"))

var positive_persons_data = new XMLHttpRequest()

// マップのところ
positive_persons_data.addEventListener('load', () => {
  let json_data = positive_persons_data.response
  let obj_data = JSON.parse(json_data)
  let cities = Object.keys(obj_data)
  let ppem30 = []
  for (const city of cities) {
    let element_city = document.getElementById(city)
    let colors = ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C']
    if (element_city != null) {
      // console.log(element_city)
      let num = obj_data[city]
      ppem30.push(
        <fast-tree-item>
          {city}&nbsp;<strong>{obj_data[city]}</strong>
        </fast-tree-item>
        // <span>{city}&nbsp;<strong>{obj_data[city]}</strong></span>
      )
      if (num === 0) {
        element_city.style.fill = "#c4c4c4"
      } else {
        let color_idx = parseInt((Math.log10(num)).toString())
        element_city.style.fill = colors[color_idx]
        element_city.style.stroke = colors[color_idx]
      }
    }
  }
  ReactDOM.render(ppem30, document.getElementById("ppem30"))
})
positive_persons_data.open('GET', 'https://himeyama.github.io/cov2-yamaguchi-data/datacities30days.json')
positive_persons_data.send()

console.log(cov)

reportWebVitals()
