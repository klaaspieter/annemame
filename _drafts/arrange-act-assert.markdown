---
layout: post
title: Arrange Act Assert
---

https://github.com/testdouble/contributing-tests/wiki/Arrange-Act-Assert

Often at the start of a TDD journey we end up with tests like this:

```swift
func testArray() {
  var array = [1]
  XCTAssertEqual(array.count, 1)
  XCTAssertEqual(array[0], 1)

  array.append(2)
  XCTAssertEqual(array.count, 2)
  XCTAssertEqual(array[1], 2])

  array.removeAll()
  XCTAssertEqual(array.count, 0)
  XCTAssertEqual(array.isEmpty, 0)
}
```

At first glance it's probably fine, but as the complexity of our array grows so does this one test case. We're having to track the current state of the array throughout the test case. As time goes on it'll be harder and harder to add a new actions and assertsbecause we have to make sure the state is unchanged for the remainder of the test.

For example let's try to add a test for removing an element:

```swift
func testArray() {
  var array = [1]
  XCTAssertEqual(array.count, 1)
  XCTAssertEqual(array[0], 1)

  array.remove(0)
  XCTAssertEqual(array.isEmpty)
  XCTAssertEqual(array.count, 0)

  array.append(2)
  XCTAssertEqual(array.count, 2) // Fails
  XCTAssertEqual(array[1], 2])

  array.removeAll()
  XCTAssertEqual(array.count, 0)
  XCTAssertEqual(array.isEmpty, 0)
}
```

Our test fails because we altered the state of the array. A solution could be to create a new array `var array1 = [1]` or to append `1`. When reassigning the array we have to update the variable name througout the remainder of the test. When re-appending 1 we're relying on append to work to test removals.

As soon as we have to create a new instance of the subject under test it's clear that we should be using a separate test. Let's split this out:

```swift
func testAppend() {
  var array = []

  array.append(1)

  XCTAssertEqual(array[0], 1)
}

func testRemove() {
  var array = [1]

  array.remove(at: 0)

  XCTAssertEqual(array.count, 0)
}

func testRemoveAll() {
  var array = [1, 2, 3]

  array.removeAll()

  XCTAssertEqual(array.count, 0)
}
```

These tests are easy to read and understand. We only ever have to deal with a
single state per test case. The newlines are also intentional; these tests are structered using Arrange/Act/Assert.

- **Arrange** Arrange everything to it's desired state. Initialize the subject under test, inject dependencies.

- **Act** Perform the action on the subject. Typically a single line

- **Assert** 

## Assert

Assert that acting on the subject under test puts it in the expected state.

## Putting it to the test

Let's try to add a new test for sorting an array. We start with the assertion:

```swift
// Assert
XCTAssertEqual(array, [1, 2, 3, 4])
```

Then we act:

```swift
// Act
array.sort()
```

And finally we arrange:

```swift
// Act
var array = [3, 4, 1, 2]
```

Putting it together we get:

```swift
// Act
var array = [3, 4, 1, 2]

// Act
array.sort()

// Assert
XCTAssertEqual(array, [1, 2, 3, 4])
```

We write the assertion first because it's not always obvious how the subject under test is going to get to it's final state. Writing the
assertion first gives us momentum. Getting the compiler happy and the assertion to pass is a goal to work towards. It prevents getting bogged down with naming or implementation details. Get it to work and then use the test to refactor and make it better!
