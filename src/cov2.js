import React from 'react'
import ReactDOM from 'react-dom'
import { Era } from './Era'

// Fast Design
import {
    provideFASTDesignSystem,
    fastCard
  } from "@microsoft/fast-components";
provideFASTDesignSystem()
  .register(
    fastCard()
  );

class PrefMap extends React.Component {
    render() {
      // return (map_yamaguchi())
      return <div className='d-inline-block'>{this.props.pref}</div>
    }
}

class Cov2 {
    constructor() {
        this.pref = "✕〇県"
        this.update_date = "2023-01-01"
        this.update_wareki = "令和 4 年 X 月 X 日"
        this.map_date_range = 30
        this.img_pref = <div />
        this.ppem30 = <tr><td>✕〇市</td><td className='text-end'>0</td></tr>
    }

    set prefecture(pref) {
        this.pref = pref
    }

    set ppe30(jsx) {
        this.ppem30 = jsx
    }

    set datetime(date) {
        this.update_date = date
        let today = new Era(date)
        this.update_wareki = today.getWareki('和暦', false, 4)
        ReactDOM.render(this.header(), document.getElementById("header"))
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
            <fast-card class='container'>
                <div className='mx-3 my-4'>
                    <h2>最新のお知らせ</h2>
                    <ul>
                        <li>
                            <a href="https://www.hikari-dev.com">TOP</a>
                        </li>
                    </ul>
                </div>
            </fast-card>
        )
    }

    map() {
        return (
            <fast-card class='container px-4 pt-3'>
                <div className="">
                    <h2>{this.pref}陽性者マップ</h2>
                </div>
                <div className="">
                    <h3>過去 {this.map_date_range} 日間の発生状況</h3>
                    <p>{'$色の濃さ = \\log_{10}(人数)$'}</p>
                    <div id="img-map" className='d-inline-block mt-4'>
                        <PrefMap pref={this.img_pref} />
                    </div>
                </div>
            </fast-card>
        )
    }

    posis30() {
        return (
            <fast-card class='container mt-4'>
                <div className="container my-4">
                    <h2>過去 {this.map_date_range} 日間の陽性者数</h2>
                </div>
                <div className="container my-4">
                    <div className='row row-cols-2' id='ppem30'></div>
                </div>
            </fast-card>
        )
    }

    graph() {
        return (
            <fast-card class='container'>
                <div className="mx-3 my-4">
                    <h2>陽性者一覧</h2>
                    <h3>過去 {this.map_date_range} 日間の発生状況</h3>
                    <canvas id="myChart" width="400" height="400"></canvas>
                </div>
            </fast-card>
        )
    }

    title() {
        return (
            <title>{this.pref}内の最新感染動向</title>
        )
    }
}

export default Cov2
