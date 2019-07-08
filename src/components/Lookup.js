import React from 'react';
import './Lookup.css';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import randomColor from 'randomcolor';

class Lookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const fromDate = moment(data.get('from-date')).utc().format();
    const toDate = moment(data.get('to-date')).utc().format();

    axios.get(`${process.env.REACT_APP_API_URL}/jobs?fromDate=${fromDate}&toDate=${toDate}`)
      .then(res => {
        const data = {};
        res.data.data.forEach(j => {
          if (j.keywords) {
            j.keywords.forEach(k => {
              if (!data[k]) {
                data[k] = 1;
              } else {
                data[k]++;
              }
            })
          }
        });

        this.setState({
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Job Posts',
                data: Object.values(data),
                backgroundColor: randomColor({
                  count: Object.keys(data).length,
                  hue: 'random'
                })
              }
            ]
          }
        });
      });
  }

  render() {
    const fromDate = moment().subtract(30, "days").format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");
    return (
      <div>
        <div className="container">
          <div className="lookup">
            <form onSubmit={this.onSubmit}>
              <h2>Find Data</h2>
              <div className="row">
                <div className="form-field">
                  <TextField
                    id="from-date"
                    name="from-date"
                    label="From"
                    type="date"
                    defaultValue={fromDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className="date-picker" />
                </div>
                <div className="form-field">
                  <TextField
                    id="to-date"
                    name="to-date"
                    label="To"
                    type="date"
                    defaultValue={toDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className="date-picker" />
                </div>
              </div>
              <div className="section-header">
                <label>Sources</label>
              </div>
              <div className="row">
                <div className="form-field">
                  <FormControlLabel
                    control={<Checkbox name="source-indeed" disabled={true} checked={true} />}
                    label="Indeed.com"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-field">
                  <Button type="submit" variant="contained" color="primary">
                    Search<SearchIcon />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="container">
          <Bar data={this.state.data} height={500} options={{ title: { display: true, text: 'Technologies in Job Postings', fontSize: 16 }, maintainAspectRatio: false }} />
        </div>
      </div>
    )
  }
}

export default Lookup;
