# 前言

这篇博文是根据[慕课网教程](https://www.imooc.com/learn/949)整理而来，内容几乎都会是讲师的原话，外带一些自己的理解。

## Promise是什么

这个英语单词翻译成中文意思就是：许诺；允诺；有可能。因此从字面上就可以知道它代表了即将要发生的事情，从而联想到了JavaScript中异步程序。

**按照它的实际用途来看主要有以下几点**

- 用于异步计算
- 可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
- 可以在对象之间传递和操作Promise，帮助我们处理队列

## Promise产生的背景

根源是为了优化表单提交的用户体验，而开发了JavaScript这款包含大量异步操作的脚本语言。在提交表单中异步程序的表现是怎么样的呢？就是当你注册会员的时候，填写了昵称这玩意，然后再填写密码的时候，同时服务器里会检测这个昵称是否已经被注册从而做出一些回应，而不用等你全部信息填写好点击提交才告诉你昵称已经存在。

借由异步的这一个特点，可以想到：异步操作能够避免界面冻结！异步的本质用大白话说就是：将耗时很长的A交付的工作交给系统之后，就去继续做B交付的工作。等到系统完成前面的工作之后，再通过回调或者事件，继续做A交付的剩下的工作。

从观察者的角度看起来，AB工作的完成顺序，和交付它们的时间顺序无关，所以叫“异步”。

**咳咳，说重点，以下才是Promise诞生的原因**

- 解决因为异步操作所带来的回调地狱，从而导致维护性差，下面请看回调代码

```js
a(function (resultsFromA) {
  b(resultsFromA, function (resultsFromB) {
    c(resultsFromB, function (resultsFromC) {
      d(resultsFromC, function (resultsFromD) {
        e(resultsFromD, function (resultsFromE) {
          f(resultsFromE, function (resultsFromF) {
            console.log(resultsFromF);
          })
        })
      })
    })
  })
});
```

- 总结就是曾经的异步操作依赖的回调函数中存在着“**嵌套层次深，难以维护**”、“**无法正常使用return和throw**”、“**无法正常检索堆栈信息**”和“**多个回调之间难以建立联系**”这四个主要问题需要被解决，于是Promise横空出世。
- 最后一点：到底啥是[回调函数](https://www.zhihu.com/question/19801131)啊？？！

## Promise的概念和优点

【优点】

- Promise是一个代理对象，它和原先要进行的操作并无关系
- Promise通过引入一个回调，避免了更多的回调

【状态】

- pending：待定，称为初始状态
- fulfilled：实现，称为操作成功状态
- rejected：被否决，称为操作失败状态
- 当Promise状态发生改变的时候，就会触发.then()里的响应函数来处理后续步骤
- Promise状态已经改变，就不会再变

## Promise的基本语法

```js
new Promise(
    /* 执行器 executor */
    function (resolve, reject) {
      // 一段耗时很长的异步操作
      resolve(); // 数据处理完成
      reject(); // 数据处理出错
    }
 ).then(function A() {
    // 成功，下一步
  }, function B() {
    // 失败，做相应处理
  });
```

## 异步操作的常见方法

首先看课程里提供的方法

```js
// 事件侦听与响应
document.getElementById('start').addEventListener('click', start, false);
function start() {
  // 响应事件，进行相应的操作
}

// jQuery 用 `.on()` 也是事件侦听
$('#start').on('click', start);

// 回调，比较常见的有ajax
$.ajax('http://baidu.com', {
  success: function (res) {
    // 这里就是回调函数了
  }
});

// 或者在页面加载完毕后回调
$(function () {
  // 这里也是回调函数
});
```

以上是课程稍微提到的方法，下面请看阮一峰老师的进一步说明，面试的时候可以使劲说啦，[传送门](http://www.ruanyifeng.com/blog/2012/12/asynchronous＿javascript.html)在此。

## Promise一个简单的例子

```js
console.log('here we go');
new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
      console.log(123);
    }, 2000);
  })
  .then(name => {
    console.log(name + ' world');
  });
```

以上代码和课程稍微有些不同，目的是和定时器做一些对比，以此发现一点什么。

```js
console.log('here we go');
setTimeout(() => {
  callback("hello");
  console.log(123);
}, 2000)

function callback(name) {
  console.log(name + ' world');
}
```

通过以上两段代码的运行结果比较，可以浅显的得出：**resolve()状态引发的then()是异步的**，更多的我暂时就不知道啦。

## Promise两步执行的范例

```js
console.log('here we go');
new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
    }, 2000);
  })
  .then(value => {
    console.log(value);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('world');
      }, 2000);
    });
  })
  .then(value => {
    console.log(value + ' world');
  });
```

这个范例主要是简单的演示了Promise如何解决**回调地狱**这个让人头大的问题。

## 对已经完成的Promise执行then()

```js
console.log('start');
let promise = new Promise(resolve => {
  setTimeout(() => {
    console.log('the promise fulfilled');
    resolve('hello, world');
  }, 1000);
});

setTimeout(() => {
  promise.then(value => {
    console.log(value);
  });
}, 3000);
```

讲师的原话：这段代码展示了Promise作为队列这个重要的特性，就是说我们在任何一个地方生成了一个Promise对象，都可以把它当做成一个变量传递到其他地方执行。不管Promise前面的状态到底有没有完成，队列都会按照固定的顺序去执行。

## then()不返回Promise

```js
console.log('here we go');
new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
    }, 2000);
  })
  .then(value => {
    console.log(value);
    console.log('everyone');
    (function () {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Mr.Laurence');
          resolve('Merry Xmas');
        }, 2000);
      });
    }());
    return false; // 没有等待上面的立即执行函数返回，直接返回false，执行下面的then
  })
  .then(value => {
    console.log(value + ' world');
  });
```

我对以上代码的理解是这样的：最后一个then()方法里的value值代表的是上一个then()里的返回值，当没有return的时候，默认返回值为undefined。而resolve()里的数据为什么没被调用呢？因为上一个then()方法里return的是false而不是Promise实例。

要想调用resolve()里的数据，只要这么写就可以了

```js
console.log('here we go');
new Promise(resolve => {
    setTimeout(() => {
      resolve('hello');
    }, 2000);
  })
  .then(value => {
    console.log(value);
    console.log('everyone');
    (function () {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Mr.Laurence');
          resolve('Merry Xmas');
        }, 2000);
      });
    }()).then(value => {
      console.log(value + ' world');
    });
  })
```

## then()解析

- then()接受两个函数作为参数，分别代表fulfilled和rejected
- then()返回一个新的Promise实例，所以它可以链式调用
- 当前面的Promise状态改变时，then()根据其最终状态，选择特定的状态响应函数执行
- 状态响应函数可以返回新的Promise或其他值
- **如果返回新的Promise，那么下一级then()会在新的Promise状态改变之后执行**
- 如果返回其他任何值，则会立刻执行下一级then()

## then()的嵌套

then()里面有then()的情况：因为then()返回的还是Promise实例，故会等里面的then()执行完，再执行外面的，因此对于我们来说，此时最好将其展开，会更好的进行阅读。以下是then嵌套的代码

```js
console.log('start');
new Promise(resolve => {
    console.log('Step 1');
    setTimeout(() => {
      resolve(100);
    }, 1000);
  })
  .then(value => {
    return new Promise(resolve => {
        console.log('Step 1-1');
        setTimeout(() => {
          resolve(110);
        }, 1000);
      })
      .then(value => {
        console.log('Step 1-2');
        return value;
      })
      .then(value => {
        console.log('Step 1-3');
        return value;
      });
  })
  .then(value => {
    console.log(value);
    console.log('Step 2');
  });
```

**解套后的代码为：**

```js
console.log('start');
new Promise(resolve => {
    console.log('Step 1');
    setTimeout(() => {
      resolve(100);
    }, 1000);
  })
  .then(value => {
    return new Promise(resolve => {
      console.log('Step 1-1');
      setTimeout(() => {
        resolve(110);
      }, 1000);
    })
  })
  .then(value => {
    console.log('Step 1-2');
    return value;
  })
  .then(value => {
    console.log('Step 1-3');
    return value;
  })
  .then(value => {
    console.log(value);
    console.log('Step 2');
  });
```

两段代码的执行结果一致（话说此时你们清楚的知道结果是啥吗）。

## Promise小测试

看以下代码进行分析四种Promise的区别是什么？是什么原因导致了不同的执行流程？

```js
// 问题一
doSomething()
  .then(function () {
    return doSomethingElse();
  })
  .then(finalHandler);
//执行流程为doSomething ==> doSomethingElse(undefined) ==> finalHandler(resultDoSomethingELlse)

// 问题二
doSomething()
  .then(function () {
    doSomethingElse();
  })
  .then(finalHandler);
//执行流程为doSomething ==> doSomethingElse(undefined) ==> finalHandler(undefined)
//注意：doSomethingElse(undefined)和finalHandler(undefined)同时执行

// 问题三
doSomething()
  .then(doSomethingElse())
  .then(finalHandler);
//执行流程为doSomething ==> doSomethingElse(undefined) ==> finalHandler(resultOfDoSomething)
//注意：doSomethingElse(undefined)和doSomething()同时执行


// 问题四
doSomething()
  .then(doSomethingElse)
  .then(finalHandler);
//执行流程为doSomething ==> doSomethingElse(resultOfDoSomething) ==> finalHandler(resultOfDoSomethingElse)
```

## Promise错误处理

因为在这一块，讲师貌似犯了些小错误，很多人反应很强烈，至于这错误到底是不是错误我也不太懂，但是不能把有异议的内容也写进来吧，于是我在网上找了篇自己能理解的Promise错误处理，贴上来给大家看看。

谈到Promise错误处理，就要把reject拿出来晾一晾了。reject的作用就是把Promise的状态置为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调（严格来说这不算是错误处理吧。。。），看下面的代码。

```js
function getNumber() {
  var p = new Promise(function(resolve, reject) {
    //做一些异步操作
    setTimeout(function() {
      var num = Math.ceil(Math.random() * 10); //生成1-10的随机数
      if(num <= 5) {
        resolve(num);
      } else {
        reject('数字太大了');
      }
    }, 2000);
  });
  return p;
}
getNumber().then(function(data) {
  console.log('resolved');
  console.log(data);
}, function(reason) {
  console.log('rejected');
  console.log(reason);
});
```

getNumber函数用来异步获取一个数字，2秒后执行完成，如果数字小于等于5，我们认为是“成功”了，调用resolve修改Promise的状态。否则我们认为是“失败”了，调用reject并传递一个参数，作为失败的原因。

运行getNumber并且在then中传了两个参数，then方法可以接受两个参数，第一个对应resolve的回调，第二个对应reject的回调。所以我们能够分别拿到他们传过来的数据。多次运行这段代码，你会随机得到“成功”和“失败”的两种结果。

**另一种处理错误和异常的方法：catch。** 其实它和上面then的第二个参数一样，用来指定reject的回调，用法是这样的：

```js
function getNumber() {
  var p = new Promise(function(resolve, reject) {
    //做一些异步操作
    setTimeout(function() {
      var num = Math.ceil(Math.random() * 10); //生成1-10的随机数
      if(num <= 5) {
        resolve(num);
      } else {
        reject('数字太大了');
      }
    }, 2000);
  });
  return p;
}
getNumber().then(function(data) {
  console.log('resolved');
  console.log(data);
}).catch(function(reason) {
  console.log('rejected');
  console.log(reason);
});
```

效果和写在then的第二个参数里面一样。不过它还有另外一个作用：在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中，请看下面的代码，然后分别代入自行测试一下

```js
// 测试代码1
getNumber().then(function(data) {
  console.log(name());
  console.log('resolved');
  console.log(data);
}, function(reason, data) {
  console.log('rejected');
  console.log(reason);
});
// 测试代码2
getNumber().then(function(data) {
  console.log(name());
  console.log('resolved');
  console.log(data);
}).catch(function(reason) {
  console.log('rejected');
  console.log(reason);
});
```

在resolve的回调中，我们console.log(name());而name()这个函数是没有被定义的。如果我们不用Promise中的 catch，代码运行到这里就直接在控制台报错了，不往下运行，但是使用catch就不同了。

也就是说进到catch方法里面去了，而且把错误原因传到了reason参数中。即便是有错误的代码也不会报错了，这与我们的try/catch语句有相同的功能。

## Promise.all()解析

Promise.all()具有**批量执行**的特点，用于将多个Promise实例，包装成一个新的Promise实例，返回的就是普通Promise。

它接受一个数组作为参数，数组里可以是Promise对象，也可以是别的值，只有Promise会等待状态的改变。

当所有子Promise都完成，那么返回新的Promise才认为是完成了，返回值是全部值的数组；有任何一个失败，则新的Promise就认为失败了，返回值是第一个失败的子Promise的结果。下面看代码：

```js
console.log('here we go');
Promise.all([1, 2, 3]).then(all => {
  console.log('1：', all);
  return Promise.all([function() {
    console.log('ooxx');
  }, 'xxoo', false]);
}).then(all => {
  console.log('2：', all);
  let p1 = new Promise(resolve => {
    setTimeout(() => {
      resolve('I\'m P1');
    }, 1500);
  });
  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('I\'m P2');
    }, 1000);
  });
  let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('I\'m P3');
    }, 3000);
  });
  return Promise.all([p1, p2, p3]);
}).then(all => {
  console.log('all', all);
}).catch(err => {
  console.log('Catch：', err);
});
```

真是让人头大的代码，建议各位还是先来看看这篇吧——[大白话讲解Promise](https://www.cnblogs.com/lvdabao/p/es6-promise-1.html)

## Promise实现队列

有时候我们不希望所有动作一起发生，而是按照一定顺序，逐个进行，用代码解释就是如下这样的：

```js
let promise = doSomething();
promise = promise.then(doSomethingElse);
promise = promise.then(doSomethingElse2);
promise = promise.then(doSomethingElse3);
.........
```

实现队列方式一：**使用forEach()**

```js
function queue(things) {
  let promise = Promise.resolve();
  things.forEach(thing => {
   promise.then(() => {
      return new Promise(resolve => {
        doThing(thing, () => {
          resolve();
        });
      });
    });
  });
  return promise;
}
queue(['lots', 'of', 'things', ....]);
```

【注意】
常见错误：没有把then()产生的新Promise实例赋给promise，没有生成队列。

实现队列方式二：**使用reduce()**

```js
function queue(things) {
  return things.reduce((promise, thing) => {
    return promise.then(() => {
      return new Promise(resolve => {
        doThing(thing, () => {
          resolve();
        });
      });
    });
  }, Promise.resolve());
}
queue(['lots', 'of', 'things', ....]);
```

## Promise.resolve()解析

Promise.resolve()返回一个fulfilled状态的Promise实例，或原始的Promise实例，具有如下特点：

- 参数为空，返回一个状态为fulfilled的Promise实例
- 参数是一个跟Promise无关的值，同上，不过fulfilled响应函数会得到这个参数
- 参数为Promise实例，则返回该实例，不做任何修改
- 参数为thenble，则立刻执行它的then()
  看以下代码逐一分析

```javascript
console.log('start');
Promise.resolve().then(() => {
  console.log('Step 1');
  return Promise.resolve('Hello');
}).then(value => {
  console.log(value, 'World');
  return Promise.resolve(new Promise(resolve => {
    setTimeout(() => {
      resolve('Good');
    }, 2000);
  }));
}).then(value => {
  console.log(value, ' evening');
  return Promise.resolve({
    then() {
      console.log(', everyone');
    }
  })
})
```

## Promise.reject()解析

Promise.reject()除了不认thenable，其他的特点都和Promise.resolve()类似，请看如下代码：

```js
let promise = Promise.reject('something wrong');
promise.then(() => {
  console.log('it\'s ok');
}).catch(() => {
  console.log('no, it\'s not ok');
  return Promise.reject({
    then() {
      console.log('it will be ok');
    },
    catch() {
      console.log('not yet');
    }
  });
});
```

## Promise.race()解析

类似Promise.all()，区别在于它有任意一个完成就算完成，观察以下代码：

```js
console.log('start');
let p1 = new Promise(resolve => {
  // 这是一个长时间的调用
  setTimeout(() => {
    resolve('I\'m P1');
  }, 10000);
});
let p2 = new Promise(resolve => {
  // 这是个稍短的调用
  setTimeout(() => {
    resolve('I\'m P2');
  }, 2000)
});
Promise.race([p1, p2]).then(value => {
  console.log(value);
});
```

Promise.race()常见用法是把异步操作和定时器放在一起，如果定时器先触发，就认为超时，告知用户。这里可能说的有点抽象，希望来这里看一看——[大白话讲解Promise](https://www.cnblogs.com/lvdabao/p/es6-promise-1.html)，那么很容易就能明了。

## 现实生活中的Promise应用

- 把回调函数包装成Promise，使其可读性更好和返回的结果可以加入任何Promise队列
- 把任何异步操作包装成Promise，假设有这需求：用户点击按钮，弹出确认窗体 ==> 用户确认和取消有不同的处理。那么就能编写如下代码：

```js
// 弹出窗体
let confirm = popupManager.confirm('您确定么？');
confirm.promise.then(() => {
  // do confirm staff
}).catch(() => {
  // do cancel staff
});
// 窗体的构造函数
class Confirm {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.confirmButton.onClick = resolve;
      this.cancelButton.onClick = reject;
    })
  }
}
```

## 尾声

呃呃，IE那块我选择不鸟它了，一个连它爸爸都嫌弃的浏览器也是没救了。还有最新的异步函数async和await，不说了，困得一批，劳资下班睡觉去。

最后的最后，强烈推荐一篇反复出现的博文和那位博主，有非常值得学习的地方：[大白话讲解Promise](https://www.cnblogs.com/lvdabao/p/es6-promise-1.html)