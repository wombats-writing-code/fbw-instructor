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
              <a href="/guide#intepreting-results">Intepreting results</a>
            </li>
            <li className="toc__item">
              <a href="#making-phase2" className="coming-soon">Making a Phase II mission (coming soon)</a>
            </li>
          </ol>
        </section>

        <div className="content medium-9 columns">
          <section className="making-mission" id="making-phase1">
            <div className="row">
              <h3 className="columns">Making a Phase I mission</h3>
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

          <section className="intepreting-results" id="intepreting-results">
            <ol className="instruction-list">
              <li className="instruction">
                <p>Now that your Mission has been opened to students, click the Mission to view its results.
                  It may take several seconds to load.</p>
              </li>
              <li className="instruction">
                <p>The top bar shows you the summary for Phase I.
                  In this example, 2 students have opened up the mission on the app.
                  5 students have not even opened up the Mission.
                  Click on <span className="button-ref">Show</span> to see more detail.
                </p>

                <img src={require("./assets/phase1-results-summary.png")} />

                <p>
                  You see the directives of the mission. Click on one of them:
                </p>
                <p>
                  You see a list of Target questions corresponding to the directive.
                  Clicking on the arrow will expand the question so you can see its choices.
                </p>
                <img src={require("./assets/phase1-results.png")} />
                <p>
                  Keep in mind these results are shown in <b>real time</b>.
                </p>
                <p>
                  You can also click on a student's name to see what they did on their Mission.
                  This will show you their Mission exactly as they saw it.
                </p>
                <img src={require("./assets/look-at-student.png")} />
              </li>
              <li className="instruction">
                <p>After the Phase I mission closes, you will launch Phase II.
                  First, click on Show.
                </p>
                <img src={require("./assets/recommend-bar-summary.png")} />
                <p>You see the list of students who will get Phase II.</p>
                <p>Check to see that the dates for Phase II are correct. If not, change them.</p>
                <div className="row">
                  <img className="medium-7 columns" src={require("./assets/phase2-edit.png")} />
                </div>
              </li>
              <li className="instruction">
                <p>When you are ready, click on <span className="button-ref">Launch Phase II Missions!</span>
                </p>
                <p>This will take a while, around 5 minutes. How about a coffee break?</p>
                <div className="row">
                  <img className="medium-4 columns" src={require("./assets/phase2-working.png")} />
                </div>
                <p>
                  When Phase II missions have been launched, remember to manually send out an email to students to remind them to do Phase II.
                  We don't yet have that feature :( but we will soon!
                </p>
                <p>
                  When Phase II missions are freshly launched, you will see there are no results yet.
                  However, you will see an ongoing grade report that tracks how many percentage points the student has earned <b>so far</b>.
                  This is in <b>real time</b>!
                </p>
                <div className="row">
                  <img className="medium-9 columns" src={require("./assets/phase2-results.png")} />
                </div>
              </li>
            </ol>
          </section>

        </div>

      </div>
    )
  }
}

export default Guide
