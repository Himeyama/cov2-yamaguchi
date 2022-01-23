import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import App from './App'
import { Era } from './Era'
import map_yamaguchi from './Map'
import reportWebVitals from './reportWebVitals'

// Microsoft Fast
import { 
  provideFASTDesignSystem,
  fastCard, 
  fastButton,
  fastAvatar,
} from '@microsoft/fast-components'
import { provideReactWrapper } from '@microsoft/fast-react-wrapper'

const { wrap } = provideReactWrapper(
  React, 
  provideFASTDesignSystem()
)

export const FastCard = wrap(fastCard())
export const FastButton = wrap(fastButton())
export const FastAvater = wrap(fastAvatar())

// 地図を描く
class PrefMap extends React.Component<any, any> {
  render() {
    // return (map_yamaguchi())
    return <div className='d-inline-block'>{this.props.pref}</div>
  }
}

// Header
class Cov2 {
  pref: string
  update_date: string
  update_wareki: string | null
  map_date_range: number
  img_pref: JSX.Element
  ppem30: JSX.Element

  constructor() {
    this.pref = "✕〇県"
    this.update_date = "2022-01-01"
    this.update_wareki = "令和 3 年 1 月 1 日"
    this.map_date_range = 30
    this.img_pref = <div />
    this.ppem30 = <tr><td>✕〇市</td><td className='text-end'>0</td></tr>
  }

  set prefecture(pref: string) {
    this.pref = pref
  }

  set ppe30(jsx: any) {
    this.ppem30 = jsx
  }

  set datetime(date: string) {
    this.update_date = date
    let today: Era = new Era(date)
    this.update_wareki = today.getWareki('和暦', false, 4)
    ReactDOM.render(cov2.header(), document.getElementById("header"))
  }

  header() {
    return (
      <div className='container mt-3'>
        <h1 className='d-inline-block'>{this.pref}内の新型コロナ陽性者情報</h1>
        <span className='ms-2 d-inline-block'>
          <time className='me-1' dateTime={this.update_date}>{this.update_wareki}</time>更新
        </span>
      </div>
    )
  }

  news() {
    return (
      <FastCard className='container'>
        <div className='mx-3 my-4'>
          <h2>最新のお知らせ</h2>
          <ul>
            <li>
              <a href="/#">hogehoge</a>
            </li>
          </ul>
        </div>
      </FastCard>
    )
  }

  map() {
    return (
      <FastCard className='container'>
        <div className="mx-3 my-4">
          <h2>{this.pref}陽性者マップ</h2>
        </div>
        <div className="mx-3 my-4">
          <h3>過去 {this.map_date_range} 日間の発生状況</h3>
          <span>(30 日間の陽性者数 / 10 万人)</span>
          <div id="img-map" className='d-inline-block mt-4'>
            <PrefMap pref={this.img_pref} />
          </div>
        </div>        
      </FastCard>
    )
  }

  posis30() {
    return (
      <FastCard className='container mt-4'>
        <div className="container my-4">
          <h2>過去 {this.map_date_range} 日間の陽性者数</h2>
        </div>
        <div className="container my-4">
          <div className='row row-cols-2' id='ppem30'></div>
        </div>
      </FastCard>
    )
  }

  graph(){
    return (
      <FastCard className='container'>
        <div className="mx-3 my-4">
          <h2>陽性者一覧</h2>
          <h3>過去 {this.map_date_range} 日間の発生状況</h3>
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
      </FastCard>
    )
  }

  title(){
    return (
      <title>{this.pref}内の最新感染動向</title>
    )
  }
}

const cov2 = new Cov2()
cov2.prefecture = "山口県"
cov2.img_pref = map_yamaguchi()
// 更新日時
cov2.datetime = "2021-01-01"
// 過去 30 日間の発生状況
cov2.map_date_range = 30

ReactDOM.render(cov2.news(), document.getElementById("news"))
ReactDOM.render(cov2.title(), document.getElementById("page-title"))
ReactDOM.render(cov2.map(), document.getElementById("pref-map"))
ReactDOM.render(cov2.graph(), document.getElementById("graph"))
ReactDOM.render(cov2.posis30(), document.getElementById("posis30"))

var positive_persons_data = new XMLHttpRequest()

// マップのところ
positive_persons_data.addEventListener('load', () => {
  let json_data: string = positive_persons_data.response
  let obj_data = JSON.parse(json_data)
  let cities: string[] = Object.keys(obj_data)
  let ppem30 = []
  for(const city of cities){
    let element_city: HTMLElement | null = document.getElementById(city)
    let colors: string[] = ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C']
    if(element_city != null){
      // console.log(element_city)
      let num: number = obj_data[city]
      ppem30.push(
        <div className='px-1 py-1'>
          <FastCard className='col px-2 py-2'>
          <span>{city}&nbsp;<strong>{obj_data[city]}</strong></span>
        </FastCard>
      </div>)
      if(num === 0){
        element_city.style.fill = "#c4c4c4"
      }else{
        let color_idx = parseInt(((num-1)/100).toString())
        element_city.style.fill = colors[color_idx]
        element_city.style.stroke = colors[color_idx]
      }
    }
  }
  ReactDOM.render(ppem30, document.getElementById("ppem30"))
})
positive_persons_data.open('GET', 'https://covid19.hikari-dev.com/cov2-data/positive_persons_each_municipality_30days_100K.json')
positive_persons_data.send()

console.log(cov2)

reportWebVitals()
