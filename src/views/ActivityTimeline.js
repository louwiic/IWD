import React from "react";
import { Card } from "react-bootstrap";
import "./ActivityTimeline.css";

const ActivityTimeline = ({ activities }) => {
  return (
    <Card.Body>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 className="activity-title">Dernières activités</h4>
        <ul className="timeline">
          {activities.map((activity, index) => (
            <li key={index}>
              <div className={`icon ${activity.icon}`} />
              <div className="timeline-content">
                <h5>{activity.text}</h5>
                <span>{activity.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card.Body>
  );
};

export default ActivityTimeline;
