import React from 'react';
import './Lookup.css';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import randomColor from 'randomcolor';
import { Formik, Form, Field } from 'formik';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const FilterForm = ({ setState, state }) => (
  <div>
    <h2>Find Data</h2>
    <Formik
      initialValues={{ fromDate: moment().subtract(30, 'days').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') }}
      validate={values => { }}
      onSubmit={(values, { setSubmitting }) => {
        const fromDate = moment(values.fromDate).utc().format();
        const toDate = moment(values.toDate).utc().format();
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

            setState({
              ...state,
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
            setSubmitting(false);
          })
          .catch((error) => {
            setState({ ...state, snackbarOpen: true, message: error.response && error.response.data ? error.response.data : 'An error has occurred.' });
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <div className='row'>
            <div className='form-field'>
              <DatePicker
                name={'fromDate'}
                format='MM/DD/YYYY'
                value={values['fromDate']}
                onChange={e => setFieldValue('fromDate', e)}
                label={'From Date'}
              />
            </div>
            <div className='form-field'>
              <DatePicker
                name={'toDate'}
                format='MM/DD/YYYY'
                value={values['toDate']}
                onChange={e => setFieldValue('toDate', e)}
                label={'To Date'}
              />
            </div>
          </div>
          <div className='section-header'>
            <label>Sources</label>
          </div>
          <div className='row'>
            <div className='form-field'>
              <Field name='source-indeed' checked={true} disabled={true} component={Checkbox} />
              <label>Indeed.com</label>
            </div>
          </div>
          <div className='row'>
            <div className='form-field'>
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Search<SearchIcon />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

function TransitionDown(props) {
  return <Slide {...props} direction='down' />;
}

class Lookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { snackbarOpen: false, data: {} };
    this.setState = this.setState.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ ...this.state, snackbarOpen: false });
  }

  render() {
    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className='container'>
            <div className='lookup'>
              <FilterForm setState={this.setState} state={this.state} />
            </div>
          </div>
          <div className='container'>
            <Bar data={this.state.data} height={500} options={{ title: { display: true, text: 'Technologies in Job Postings', fontSize: 16 }, maintainAspectRatio: false }} />
          </div>
        </MuiPickersUtilsProvider>
        <Snackbar
          variant='error'
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.state.snackbarOpen}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id='message-id'>{this.state.message}</span>}
          TransitionComponent={TransitionDown}
        />
      </div>
    )
  }
}

export default Lookup;
