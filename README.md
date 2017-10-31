# Roadmap
- Notification
- Refactor the code
- Add a lot of words to test performance
- App's icon
- Finalize the test suite
- Publish
- LAST_OPENED should be updated in WordScreen, ShuffleScreen

# Minor fixes
- Reposition the buttons in the app bar
- In AddScreen, after a word is added, the definition box is focused, not the word. Should be the opposite
- After sometime, remove all traces of old state.currentWord
- After sometime, remove all traces of DummyNavigators


## Medium priority
- Add filter for each word
- Add response in AddScreen so that users know each word is added successfully
- A slight tutorial in Shuffle screen
- Add the ability to note and examples
- Normalize Redux state and move some state components from arrays to objects

## Low priority
- Make the status bar's search input an expandable button (likely need some Animation).
- [List] Provide popup menu for each list item that allows quick access to Editing and Deleting.

## Learned
- SORTED_SCORES should not be an array of ALL_WORDS' indices. Since in a session, the length of ALL_WORDS can change (because words can be either removed or added), the indices in SORTED_SCORES will not accurately point to the corresponding word in ALL_WORDS.
 + One possible solution for SORTED_SCORES will look like:

{% highlight javascript %}
var SORTED_SCORES = {
  0: [[word1, def1], [word2, def2]],
  1: [[word3, def3]],
  // ... {score: [[word, def] that has that score]}
}
{% endhighlight %}


- Current development procedure:
 + When adding new feature (assuming that the overall structure of the program has been determined):
  * List out all functionalities (thinking as end-user).
  * For each functionality, list out (1) all states, functions that all the components in this feature needs to access, (2) requirements for the implementation of this functionality, (3) any potential problem and solution, and (4) crude step-by-step procedure of what needs to be done.
  * Think of state structure that can best serve all functionalities above. Remember to decouple the data to minimize the amount of UI updates after each state update.
  * Based on the previous information, write test suites.
  * Then code.
 + TL;DR: (1) think as users to determine the functionality and how the app should look, (2) design internal data state (what information to store, how to organize the information) to accommodate the functionality and user experience, make sure to normalize state as much as possible, (3) everything else builds from there.
 + https://blog.realm.io/introducing-realm-react-native/

- Component's lifecycle:
 + When a component is first created:
  * `constructor`
  * `componentWillMount`
  * `render`
  * `componentDidMount`
+ When a component is updated:
 * `componentWillReceiveProps(nextProps)`: can call `this.setState` here
 * `shouldComponentUpdate(nextProps, nextState)`: compare nextProps & nextState to the current props and state to determine whether the component should be re-rendered (true) or not (false)
 * `componentWillUpdate(nextProps, nextState)`: do not call `this.setState` at this step; this step should be used to prepare before the update
 * `render`
 * `componentDidUpdate(prevProps, prevState)`
+ When a component is destroyed:
 * `componentWillUnmount`

- An important note on how React component will update when a new Redux state is return:
>> For React Redux, connect checks to see if the props returned from a mapStateToProps function have changed in order to determine if a component needs to update. To improve performance, connect takes some shortcuts that rely on the state being immutable, and uses shallow reference equality checks to detect changes. This means that changes made to objects and arrays by direct mutation will not be detected, and components will not re-render.
