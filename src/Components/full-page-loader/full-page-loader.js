import React from 'react';
// Redux Start
import { connect } from 'react-redux';
// Redux End

class FullPageLoader extends React.Component {
    
    render(){
        const {loading} = this.props;
        if(!loading) return null;
        return (
            <div className="full-page-loader">Loading</div>
        )
    }
}

const mapStateToProps = state => ({loading: state.application.loading})
export default connect(mapStateToProps, null)(FullPageLoader);