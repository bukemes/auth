# Types of Tests

## Static
Catch typos, type-errors as you write the code. <br>
In our case, this is handled by TypeScript & ESLint.

## Unit
-> large amount of these <br>
-> Uses mocks, does not fully run the application.<br>
Used to verify that individual, isolated parts work as expected. 

Unit tests typically test something small that has no dependencies or will mock those dependencies (effectively swapping what could be thousands of lines of code with only a few). 

## Integration
-> medium amount of these <br>
-> Can either still use mocks, or run the complete application.<br>
Verify that several units work together in harmony. 


## End to End
-> low amount of these <br>
-> application deployed with front/back/database<br>
A helper robot that behaves like a user clicking around the app and verifying it all works correctly.
