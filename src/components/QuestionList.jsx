import React from 'react';
import { connect } from 'react-redux';
import TagsList from './TagsList';

const QuestionListItem = ({title, tags}) => (
    <div className="mb-3">
        <h3>{title}</h3>
        <div className="mb-2">
            <TagsList tags={tags} />
        </div>
    </div>
);

const QuestionList = ({questions}) => (
    <div>
        { questions && questions.length ?   
            <div>
                {questions.map(questions=><QuestionListItem key={questions.question_id} {...questions}/>)}
            </div> :
            <div>
                ...loading
            </div>   
    }
    </div>
);

const mapStateToProps =({questions}) => ({
    questions
})

export default connect(mapStateToProps)(QuestionList);