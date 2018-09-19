# acker
Acker is a utility used to log the progress of long-running jobs of finite length

## usage

```
const Acker = require('acker');

const acker = new Acker();
acker.total = 100; // need to do 100 things

acker.ack(); // ONE thing done
acker.ack(10) // chunk of 10 done
-> `----- 11% done! -----` // logged

acker.message = 'We are PCT done, INCR if you care' // optional - PCT will become `x%`, INCR will become `x of y`
acker.ack(70);
-> `We are 81% done, 81 of 100 if you care`
```

### Config Object
Acker can be initialized with a config object:
```
let acker = new Acker({
  total: 100, // need to do 100 things
  percentage: 5, // optional - log every 5 percent of progress (default 10)
  logger: console.log, // optional - logger to use (default console.log)
  message: 'We are PCT done, INCR if you care' // optional - PCT will become `x%`, INCR will become `x of y`
});
```

### Accessors

`acker.total` - get or set total

`acker.logger` - get or set logger function

`acker.progress` - get progress percentage as a raw number (33.3333)

`acker.progressString` - get progress percentage as a nice string ('33%')

`acker.logPercentage` get or set the logging percentage
