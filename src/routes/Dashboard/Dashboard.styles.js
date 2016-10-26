
module.exports = StyleSheet.create({
  container: {
    // flex: 3
  },
  sidePadding: {
    paddingLeft: 21,
    paddingRight: 21
  },
  dashboardNav: {
    position: 'relative',
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 60,
    paddingBottom: 50,
    marginBottom: 21,
    backgroundColor: '#2980B9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18
  },
  dashboardNavButton: {
    padding: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    opacity: .5
  },
  selectedButton: {
    opacity: 1
  },
  buttonText: {
    color: '#fff',
    fontWeight: "500",
    letterSpacing: 1
  },
  scrollContainer: {
    height: 500
  },
  pickNumberPromptWrapper: {
    flexDirection: 'row',
    marginBottom: 21,
  },
  pickNumberPrompt: {
    fontSize: 18,
  },
  numberWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  studentNumber: {
    fontWeight: "600",
    color: "#FF6F69"
  },
  numberTries: {
    fontSize: 18,
    color: '#E37B40',
    fontWeight: "600",
  },
  ordinal: {
    fontSize: 18,
    color: '#E37B40',
    fontWeight: "500",
    fontSize: 8
  },
  loadingIndicator: {
    marginTop: 80
  }
});
