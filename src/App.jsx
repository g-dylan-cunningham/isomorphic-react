import React from 'react';
import { connect } from 'react-redux';
import QuestionList from './components/QuestionList';

const AppDisplay = ({test}) => (
    <div>
        <h1>
            Isomorphic React {test}
        </h1>
        <QuestionList />
    </div>
)

const mapStateToProps = (state, ownProps) => {
    return {
        ...state
    }
}
export default connect(mapStateToProps, null)(AppDisplay);