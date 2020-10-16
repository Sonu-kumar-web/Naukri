import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../redux/actions/profile";

import Spinner from "../layouts/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
   getCurrentProfile,
   deleteAccount,
   auth: { user },
   profile: { profile, loading },
}) => {
   useEffect(() => {
      getCurrentProfile();
   }, [getCurrentProfile]);

   // console.log("Dashboard", profile.experience);

   return loading && profile === null ? (
      <Spinner />
   ) : (
      <Fragment>
         <h1 className="large text-primary">Dashboard</h1>
         <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
         </p>
         {profile !== null ? (
            <Fragment>
               <DashboardActions />
               <Experience experience={profile.experience} />
               <Education education={profile.education} />
               <div className="my-2">
                  <button
                     className="btn btn-danger"
                     onClick={() => deleteAccount()}
                  >
                     <i className="fas fa-user-minus"></i>
                     Delete My Account
                  </button>
               </div>
            </Fragment>
         ) : (
            <Fragment>
               <Link to="#" className="btn btn-primary my-1">
                  My Profile
               </Link>
               <Link to="#" className="btn btn-primary my-1">
                  Job Postings
               </Link>
               <Link to="#" className="btn btn-primary my-1">
                  Applications by each Job posting
               </Link>
               <Link to="#" className="btn btn-primary my-1">
                  Payment History (if any)
               </Link>
               <Link to="#" className="btn btn-primary my-1">
                  Application life cycle
               </Link>
            </Fragment>
         )}
      </Fragment>
   );
};

Dashboard.propTypes = {
   getCurrentProfile: PropTypes.func.isRequired,
   deleteAccount: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
   Dashboard
);
