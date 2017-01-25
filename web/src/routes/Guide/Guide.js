import React, { Component } from 'react'
import { browserHistory } from 'react-router'


import './Guide.scss'

class Guide extends Component {

  render() {
    return (
      <div className="guide">
        <section className="toc small-12 medium-3 large-3 columns">
          <p className="bold">Table of Contents</p>
          <ol>
            <li className="toc__item">
              <a href="/guide#making-phase1">Making a Phase I mission</a>
            </li>
            <li className="toc__item">
              <a href="/guide#intepreting-results" className="coming-soon">Intepreting results (coming soon)</a>
            </li>
            <li className="toc__item">
              <a href="#making-phase2" className="coming-soon">Making a Phase II mission (coming soon)</a>
            </li>
          </ol>
        </section>

        <div className="content medium-9 columns">
          <section className="making-mission" id="making-phase1">
            <div className="row">
              <h3 className="columns">Making a mission</h3>
            </div>
            <div className="row">
              <ol className="instruction-list">
                <li className="instruction">
                  <p>Click on your FbW subject:</p>
                  <img src={require("./assets/select-subject.png")} />
                  <p>Wait for things to finish loading, then click on <span class="button-ref">Create a mission</span>:</p>
                  <img src={require("./assets/click-create-mission.png")} />
                </li>

                <li className="instruction">
                  <p>Fill out the Name, and select the start date and end date of the mission.</p>
                  <p>The start time will automatically be set to 12.01am of the starting day, and the end time is 11:59pm of the end day (local times).</p>

                  <img className="" src={require("./assets/mission-info.png")} />
                </li>

                <li className="instruction">
                  <p>Pick the goals of the mission. <b>You pick goals, not specific questions.</b></p>
                  <p>For each goal you pick, FbW will automatically give to students &#189; of the questions available in Phase I.
                    The other &#189; is reserved for Phase II.</p>

                  <img className="" src={require("./assets/selected-goals.png")} />
                </li>

                <li className="instruction">
                  <p>You can search for goals via searching by a learning outcome's words...</p>
                  <img className="" src={require("./assets/search-goals.png")} />
                  <p>...or by clicking on a module and then looking at outcomes inside the module:</p>
                  <img className="" src={require("./assets/filter-modules.png")} />
                  <p>Currently, there is yet no way to tell whether an outcome &ldquo;is intended&rdquo; to be a goal.
                    But you can usually tell because it will have more questions associated with it:
                  </p>
                  <img className="" src={require("./assets/filter-modules-goals.png")} />
                </li>

                <li className="instruction">
                  <p>Click <span className="button-ref">Create mission</span> when you're done.</p>
                  <p>Wait for it to finish working...</p>
                  <img className="" src={require("./assets/create-mission-working.png")} />
                </li>

                <li className="instruction">
                  <p>The freshly-created mission should show on-screen.</p>
                  <p>There are no results yet, but you can repeatedly click on the mission name to refresh and get the latest results.</p>
                  <img className="" src={require("./assets/freshly-created.png")} />
                </li>

              </ol>
            </div>
          </section>
        </div>

      </div>
    )
  }
}

export default Guide
