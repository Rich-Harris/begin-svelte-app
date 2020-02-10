let test = require('tape')
let data = require('@begin/data')
let sandbox = require('@architect/sandbox')
let logJSON = i => console.log(JSON.stringify(i,null,2))

/**
 * Begin Data test
 * - Demonstrates basic usage of Begin Data, a fast, free, durable, wide-column persistence store already built into your app
 */
test('Set up env', t => {
  t.plan(4)
  t.ok(data, 'Begin Data loaded')
  t.ok(data.get, 'data.get ready')
  t.ok(data.set, 'data.set ready')
  t.ok(data.destroy, 'data.destroy ready')
})

let end // Saves a reference to be used later to shut down the sandbox
test('Start sandbox', async t=> {
  t.plan(1)
  end = await sandbox.start()
  t.ok(end, 'Sandbox started!')
})

test('data.set (one document)', async t => {
  t.plan(1)
  let result = await data.set({
    table: 'tasks',
    key: 'task1'
  })
  t.ok(result.key === 'task1', 'Wrote document')
  logJSON(result,null,2)
})

test('data.get (one document)', async t => {
  t.plan(1)
  let task = await data.get({
    table: 'tasks',
    key: 'task1'
  })
  t.ok(task.key === 'task1', 'Read document')
  logJSON(task,null,2)
})

test('data.destroy (one document)', async t => {
  t.plan(1)
  let result = await data.destroy({
    table: 'tasks',
    key: 'task1'
  })
  t.ok(result, 'Deleted document')
  logJSON(result,null,2)
})

/**
 * If no key is supplied, one is created automatically
 */
test('data.set generates a unique key', async t => {
  t.plan(1)
  let result = await data.set({
    table: 'tasks'
  })
  t.ok(result.key, 'Saved document has a key')
  logJSON(result,null,2)
})

/**
 * Any (meta)data is allowed
 */
test('data.set allows for any JSON document; only table and key are reserved', async t => {
  t.plan(1)
  let result = await data.set({
    table: 'tasks',
    message: 'hello world',
    complete: false,
    timeframe: new Date(Date.now()).toISOString()
  })
  t.ok(Object.getOwnPropertyNames(result.key).length > 2, 'Saved document has multiple properties')
  logJSON(result,null,2)
})

/**
 * Save a batch of documents by passing an array
 */
test('data.set accepts an array to batch save documents', async t => {
  t.plan(1)
  let result = await data.set([{
    table: 'tasks',
    message: 'catch sunshine every day',
    complete: true,
    timeframe: new Date(Date.now()).toISOString()
  },
  {
    table: 'tasks',
    message: 'leave the phone at home on accident purpose',
    complete: false,
    timeframe: new Date(Date.now()).toISOString()
  },
  {
    table: 'tasks',
    message: 'walk the seawall',
    complete: false,
    timeframe: new Date(Date.now()).toISOString()

  }])
  t.equal(result.length, 3, 'Saved document batch')
  logJSON(result,null,2)
})

/**
 * Scan a table
 */
test('data.get can read an entire table', async t => {
  t.plan(1)
  let result = await data.get({
    table: 'tasks'
  })
  t.ok(result.length > 1, 'Got docs')
  logJSON(result,null,2)
})

test('Shut down sandbox', async t=> {
  t.plan(1)
  end()
  t.ok(true, 'shutdown')
})
