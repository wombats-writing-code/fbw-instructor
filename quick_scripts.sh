
offeredIds=("assessment.AssessmentOffered%3A581a0d3771e4822fa62c9615%40bazzim.MIT.EDU",
            "assessment.AssessmentOffered%3A581a0d0971e4822fa62c9611%40bazzim.MIT.EDU"
            )

for id in "${offeredIds[@]}"
do
  curl -X DELETE 'http://localhost:8888/middleman/banks/assessment.Bank%3A581928ad71e4822fa62c9562%40bazzim.MIT.EDU/missions/assessment.Assessment%3A5819f37071e4822fa62c95b4%40bazzim.MIT.EDU' -d "assessmentOfferedId=$id"
done
