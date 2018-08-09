import axios from 'axios';

let locationId = localStorage.getItem('location_id');
if(locationId === null){
    locationId = '8BSTTGBX5Z7VM';
}
export function getPayments(fromDate = '2017-10-15',toDate = '2017-10-21'){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/payments.general?from='+fromDate+'&to='+toDate+'&offset=-08%3A00',{headers:getAuthorizationHeader()});
}

export function getMusicBaseline(fromDate = '2017-10-31',toDate = '2017-10-31'){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/tracks.spider?from='+fromDate+'&to='+toDate+'&break=14%3A00%3A00&offset=-08%3A00', {headers:getAuthorizationHeader()});
}

export function getFeatures(fromDate = '2017-10-01',toDate = '2017-10-31'){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/tracks.features?from='+fromDate+'&to='+toDate+'&offset=-08%3A00', {headers:getAuthorizationHeader()});
}

export function getRecentTracks(){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/tracks.recent?limit=4', {headers:getAuthorizationHeader()});
}

export function getCorelationSales(){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/correlations.sales', {headers:getAuthorizationHeader()});
}

export function getCorelationPrice(){
    return axios.get('https://api.exemplar.ai/analytics/'+locationId+'/correlations.price', {headers:getAuthorizationHeader()});
}

function  getAuthorizationHeader(){
    return {'Authorization': `Bearer ${localStorage.getItem('access_token')}`};
};
