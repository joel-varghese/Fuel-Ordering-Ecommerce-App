import * as types from '../actionTypes';
import { getStatisticsDataService } from './statisticsService';

export const statisticsDataBegin = data => ({
	type: types.FETCH_STATISTICS_DATA_BEGIN,
	payload: { data }
});
export const statisticsDataFailure = data => ({
	type: types.FETCH_STATISTICS_DATA_FAILURE,
	payload: { data }
});
export const statisticsDataSuccess = data => ({
	type: types.FETCH_STATISTICS_DATA_SUCCESS,
	payload: { data }
});


// Active Accounts data

export const statisticsDataAction = (dispatch,paylaod)=>{
        return new Promise(resolve => {
            getStatisticsDataService(paylaod)
                .then(response => {
                    dispatch(
                        statisticsDataSuccess(
                            response
                        )
                    );
                    resolve(response);
                    return response;
                })
                .catch(/* istanbul ignore next */(error) => {
                    dispatch(
                        statisticsDataFailure(
                            error
                        )
                    );
                });
        });
}
