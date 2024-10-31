import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    margin: 20,
    // flex: 1,
    // alignItems: 'stretch',
    // justifyContent: 'space-between'
  },
  formContainer: {
    flexDirection: "column",
    height: 40,
    marginTop: 40,
    // marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "space-evenly",
    // alignItems: 'center'
  },
  input: {
    // height: 48,
    // borderRadius: 5,
    // overflow: 'hidden',
    backgroundColor: "#ffffff",
    // paddingLeft: 16,
    // flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  maskInput: {
    backgroundColor: "#ffffff",
    marginTop: 20,
    marginBottom: 20,
    height: 55,
    borderBottomColor: "black",
    borderRadius: 5,
    paddingLeft: 15,
  },
  viewDestino: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center'
  },
  button: {
    // height: 47,
    borderRadius: 5,
    backgroundColor: "#20A64B",
    marginTop: 20,
    marginBottom: 20,
    // width: 80,
    // alignItems: "center",
    // justifyContent: 'center'
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    // marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: "#333333",
  },
  safeAreaContainer: {
    // flex: 1,
    paddingTop: 20,
  }
});
