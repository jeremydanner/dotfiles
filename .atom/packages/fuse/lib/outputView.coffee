{$, $$, View} = require 'atom-space-pen-views'
{Emitter, Disposable, CompositeDisposable} = require 'atom'

module.exports =
LogEvent:
  class LogEvent
    constructor: (args) ->
      {@message} = args
OutputModel:
  class OutputModel extends Disposable
    logEvents: []

    constructor: (buildObserver) ->
      super @dispose
      @emitter = new Emitter

    observeLogEvents: (callback) ->
      callback(logEvent) for logEvent in @logEvents
      return @emitter.on 'new-log-event', callback

    observeOnClear: (callback) ->
      return @emitter.on 'clear', callback

    onFocusChanged: (callback) ->
      @emitter.on 'focus', callback

    log: (logEvent) ->
      @logEvents.push logEvent
      @emitter.emit 'new-log-event', logEvent

    clear: ->
      @logEvents = []
      @emitter.emit 'clear'

    focus: ->
      @emitter.emit 'focus'

    dispose: ->
      @buildLogEventSub.dispose()

OutputView:
  class OutputView extends View
    @content: ->
      @div =>
        @pre class: 'output-panel native-key-bindings', outlet: 'output', tabindex: -1

    initialize: (model) ->
      @logEventSub = model.observeLogEvents (logEvent) =>
        @log(logEvent.message)
      @clearSub = model.observeOnClear =>
        @clear()
      @oldOutputHeight = 0

    clear: ->
      @output.empty()

    log: (message) ->
      if typeof message == 'string'
        @output.append $$ ->
          @p message
      else
        @output.append message

      if not @scrollProvider?
        return

      outputHeight = @output.innerHeight()
      deltaHeight = outputHeight - @oldOutputHeight
      @oldOutputHeight = outputHeight
      atBottom = @scrollProvider.scrollTop() + @scrollProvider.innerHeight() + deltaHeight >= outputHeight
      if atBottom
        @scrollProvider.scrollTop outputHeight

    setScrollProvider: (@scrollProvider) ->
      @scrollProvider.scrollTop(@output.innerHeight())

    destroy: ->
      @logEventSub?.dispose()
      @clearSub?.dispose()
