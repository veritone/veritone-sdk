import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Area, 
  ReferenceLine 
} from 'recharts';

class SentimentGraph extends Component {
  static propTypes = {
    data: arrayOf(object)
  };

  msToTime = (duration) => {
    let h, m, s;
    s = Math.floor(duration / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    h = (h < 10) && (h > 0) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    return h + ":" + m + ":" + s;
  }

  formatPercent = (p) => {
    return p + "%";
  }

  render() {
    let { data } = this.props;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="time" tickFormatter={this.msToTime}/>
          <YAxis 
            dataKey="score"
            domain={[-100, 100]}
            tickFormatter={this.formatPercent}
          />
          <CartesianGrid />
          {/*TODO: update this to accept a prop that will change the position
          the media player plays*/}
          <ReferenceLine x={13475} stroke="orange"/>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="47.5%" stopColor="green" stopOpacity={1}/>
              <stop offset="47.5%" stopColor="red" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <Area 
            type="basis" 
            dataKey="score" 
            stroke='url(#splitColor)' 
            fill='url(#splitColor)'
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

export default SentimentGraph;