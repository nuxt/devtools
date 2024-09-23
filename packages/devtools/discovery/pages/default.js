/* eslint-env node */
const { supportedFormats } = require('../prepare/index.js')

function consumeDemos() {
  const demos = discovery.context?.model?.meta?.demos

  if (demos) {
    discovery.action.define('demos', () => demos)

    if (discovery.data) {
      discovery.cancelScheduledRender()
    }
  }
}

setTimeout(() => {
  discovery.nav.primary.append({
    className: 'github',
    content: 'text:"GitHub"',
    data: { href: 'https://github.com/lahmatiy/cpupro' },
  })
  discovery.nav.primary.append({
    className: 'full-page-mode',
    content: 'text:"Exit full page"',
    when: '#.params.flamechartFullpage',
    onClick: () => toggleFullPageFlamechart(false),
  })
  discovery.nav.menu.append({
    when: '#.actions.unloadData',
    content: 'text:"Unload cpuprofile"',
    onClick(_, ctx) {
      ctx.hide()
      ctx.widget.unloadData()
      ctx.widget.setPageHash('')
    },
  })

  discovery.nav.render(discovery.dom.nav, discovery.data, discovery.getRenderContext())

  // FIXME: temporary solution, since context is cleaning up on data load/unload
  discovery.on('data', consumeDemos)
  consumeDemos()
}, 1)

function toggleFullPageFlamechart(fullpageMode) {
  const params = { ...discovery.pageParams }

  if (fullpageMode) {
    params.flamechartFullpage = true
  }
  else {
    delete params.flamechartFullpage
  }

  discovery.setPageParams(params, true)
  discovery.cancelScheduledRender()

  discovery.dom.pageContent.classList.toggle('flamecharts-fullpage', fullpageMode)
  discovery.nav.render(discovery.dom.nav, discovery.data, discovery.getRenderContext())

  // use timeout since on scroll handler may disable scrolling
  setTimeout(() => {
    const flamechartEl = discovery.dom.container.querySelector('.flamecharts .view-flamechart')
    flamechartEl.classList.add('disable-scrolling')
    flamechartEl.classList.toggle('lock-scrolling', !fullpageMode)
  }, 10)
}

const pageIndicators = {
  view: 'page-indicators',
  content: [
    {
      className: '=`runtime ${runtime.code}`',
      title: 'Runtime',
      hint: 'md:"#### Runtime\\n\\nThe runtime is heuristically determined based on modules identified within the profile."',
      value: '=runtime | code != "unknown" ? name : `Unknown/${engine}`',
    },
    {
      view: 'page-indicator-group',
      content: [
        {
          title: 'Profiling time',
          hint: 'md{ source: "#### Profiling time\\n\\nThe time of the profiling session, excluding the time before the first sample and after the last sample, which are periods with no samples. The total profiling time is calculated by summing the durations of all captured samples and is used as the basis for computing time percentages.\\n\\nThe time before the first sample represents the start-up overhead of the profiling session, which is minimal if profiling begins at program start but may be longer if initiated during program execution.\\n\\nThe time after the last sample is typically zero unless it includes overhead from concluding the profiling session or adjustments from excluding idle samples at the end.\\n\\n- Profiling session time: `{{endTime - startTime | ms()}}`\\n- Time before first sample: `{{startNoSamplesTime | ms()}}`\\n- Time after last sample: `{{endNoSamplesTime | ms()}}`\\n- Profiling time:<br>`{{endTime - startTime | ms()}}` – `{{startNoSamplesTime | ms()}}` – `{{endNoSamplesTime | ms()}}` = `{{totalTime | ms()}}`" }',
          value: '=totalTime.ms()',
          unit: true,
        },
        {
          title: 'Samples',
          hint: 'md{ source: "#### Samples\\n\\nThe total number of samples captured during the profiling session.\\n\\nEach sample represents the CPU\'s state, including the call stack, at\xA0a\xA0specific time interval, revealing which functions are executing at each point.\\n\\nFor efficiency, CPUpro merges sequentially identical samples, reducing the workload of processing samples.\\n\\n- Captured samples: `{{#.data.sourceInfo.samples}}`\\n- Deduplicated samples: `{{#.data.samples.size()}}`" }',
          value: '=sourceInfo.samples',
        },
        {
          title: 'Sampling interval',
          hint: 'md:"#### Sampling interval\\n\\nThe median duration between consecutive samples recorded during profiling. This metric offers an estimate of the average frequency at which the CPU\'s state is captured, reflecting the profiler\'s temporal resolution.\\n\\nIn V8, you can set the sampling interval at the start of a CPU profiling session. Adjusting this interval helps balance the level of detail captured against the performance impact on the system."',
          value: '=sourceInfo.samplesInterval',
          unit: 'μs',
        },
      ],
    },
    {
      view: 'page-indicator-group',
      content: [
        {
          title: 'Call tree nodes',
          hint: 'md:"#### Call tree nodes\\n\\nA **call tree** is a data structure that represents the hierarchy of function calls during the execution of a program. It demostrates the actual sequences of function calls that occurred during the profiling session.\\n\\nThe metric indicates **the size of the tree** (the number of leafs). Typically, the number of distinct functions is less than the call tree\'s size, reflecting multiple calls to the same functions from various parts of the program."',
          value: '=sourceInfo.nodes',
        },
        {
          title: 'Call frames',
          hint: 'md:"#### Call frames\\n\\nThe count of unique functions encountered during profiling. This metric helps identify the diversity of function executions regardless of their position in the call stacks.\\n\\nUniqueness is determined by attributes such as `scriptId`, `function name`, `url`, `line number`, and `column number`."',
          value: '=callFrames.size()',
        },
      ],
    },
    {
      view: 'page-indicator-group',
      className: 'filters',
      content: {
        view: 'update-on-timings-change',
        timings: '=samplesTimingsFiltered',
        content: {
          view: 'context',
          when: 'samplesTimingsFiltered.rangeStart != null',
          content: [
            {
              view: 'block',
              className: 'page-indicator-group-tag',
            },
            {
              view: 'page-indicator',
              title: 'Samples',
              value: '=samplesTimingsFiltered.rangeSamples',
            },
            {
              view: 'page-indicator',
              title: 'Range',
              value: '=`${samplesTimingsFiltered.rangeStart.formatMicrosecondsTime()} – ${samplesTimingsFiltered.rangeEnd.formatMicrosecondsTime()}`',
            },
          ],
        },
      },
    },
  ],
}

const categoriesTimeBars = {
  view: 'timing-bar',
  data: `categoriesTimings.entries.[selfTime].({
        text: entry.name,
        duration: selfTime,
        color: entry.name.color(),
        href: entry.marker("category").href
    }).sort(duration desc)`,
  segment: {
    tooltip: [
      'text:text',
      'duration:{ time: duration, total: #.data.totalTime }',
    ],
  },
}

const categoriesTimeline = {
  view: 'block',
  className: 'category-timelines',
  data: `
        $binCount: 500;
        $totalTime: #.data.totalTime;
        $binSamples: $binCount.countSamples();

        categoriesTimings.entries.[selfTime].({
            $category: entry;

            $category,
            timings: $,
            $totalTime,
            $binCount,
            binTime: $totalTime / $binCount,
            $binSamples,
            bins: #.data.categoriesTree.binCalls($category, $binCount),
            color: $category.name.color(),
            href: $category.marker("category").href
        })
    `,
  content: [
    {
      view: 'time-ruler',
      duration: '=$[].totalTime',
      segments: '=$[].binCount',
      selectionStart: '=#.data.samplesTimingsFiltered.rangeStart',
      selectionEnd: '=#.data.samplesTimingsFiltered.rangeEnd',
      onChange: (state, name, el, data, context) => {
        // console.log('change', state);
        // const t = Date.now();
        const timings = context.data.samplesTimingsFiltered

        if (state.timeStart !== null) {
          timings.setRange(state.timeStart, state.timeEnd)
        }
        else {
          timings.resetRange()
        }

        // console.log('compute timings', Date.now() - t);
      },
      details: [
        {
          view: 'block',
          className: 'timeline-segment-info',
          content: [
            { view: 'block', content: 'text:`Range: ${#.timeStart.formatMicrosecondsTime(totalTime)} – ${#.timeEnd.formatMicrosecondsTime(totalTime)}`' },
            { view: 'block', content: 'text:`Samples: ${$[].binSamples[#.segmentStart:#.segmentEnd + 1].sum()}`' },
            { view: 'block', content: ['text:`Duration: `', 'duration:{ time: #.timeEnd - #.timeStart, total: totalTime }'] },
          ],
        },
        {
          view: 'list',
          className: 'category-timings-list',
          itemConfig: {
            className: '=bins[#.segmentStart:#.segmentEnd + 1].sum() = 0 ? "no-time"',
            postRender: (el, _, data) => el.style.setProperty('--color', data.color),
            content: [
              'block{ className: "category-name", content: "text:category.name" }',
              'duration{ data: { time: bins[#.segmentStart:#.segmentEnd + 1].sum(), total: #.timeEnd - #.timeStart } }',
            ],
          },
        },
      ],
    },
    {
      view: 'list',
      className: 'category-timelines-list',
      item: {
        view: 'link',
        className: 'category-timelines-item',
        content: [
          {
            view: 'block',
            className: 'label',
            postRender: (el, _, data) => el.style.setProperty('--color', data.color),
            content: 'text:category.name',
          },
          {
            view: 'block',
            className: 'total-percent',
            content: 'text:timings.selfTime.totalPercent().replace("%", "")',
          },
          {
            view: 'timeline-segments-bin',
            bins: '=bins',
            max: '=binTime',
            binsMax: true,
            color: '=color',
          },
        ],
      },
    },
  ],
}

const packagesList = {
  view: 'section',
  data: 'packagesTimingsFiltered',
  header: [],
  content: {
    view: 'content-filter',
    content: {
      view: 'update-on-timings-change',
      debounce: true,
      content: {
        view: 'table',
        data: 'entries.[totalTime and entry.name ~= #.filter].sort(selfTime desc, totalTime desc)',
        limit: 15,
        cols: [
          { header: 'Self time', sorting: 'selfTime desc, totalTime desc', content: 'duration:{ time: selfTime, total: #.data.totalTime }' },
          { header: 'Total time', sorting: 'totalTime desc, selfTime desc', content: 'duration:{ time: totalTime, total: #.data.totalTime }' },
          { header: 'Package', className: 'main', sorting: 'entry.name asc', content: 'package-badge:entry' },
        ],
      },
    },
  },
}

const modulesList = {
  view: 'section',
  data: 'modulesTimingsFiltered',
  header: [],
  content: {
    view: 'content-filter',
    content: {
      view: 'update-on-timings-change',
      debounce: true,
      content: {
        view: 'table',
        data: `entries
                    .[totalTime and entry.name ~= #.filter]
                    .sort(selfTime desc, totalTime desc)
                `,
        limit: 15,
        cols: [
          { header: 'Self time', sorting: 'selfTime desc, totalTime desc', content: 'duration:{ time: selfTime, total: #.data.totalTime }' },
          { header: 'Total time', sorting: 'totalTime desc, selfTime desc', content: 'duration:{ time: totalTime, total: #.data.totalTime }' },
          { header: 'Module', className: 'main', sorting: 'entry.name ascN', content: 'module-badge:entry' },
        ],
      },
    },
  },
}

const functionList = {
  view: 'section',
  data: 'functionsTimingsFiltered',
  header: [],
  content: {
    view: 'content-filter',
    content: {
      view: 'update-on-timings-change',
      debounce: true,
      content: {
        view: 'table',
        data: 'entries.[totalTime and entry.name ~= #.filter].sort(selfTime desc, totalTime desc)',
        limit: 15,
        cols: [
          { header: 'Self time', sorting: 'selfTime desc, totalTime desc', content: 'duration:{ time: selfTime, total: #.data.totalTime }' },
          { header: 'Total time', sorting: 'totalTime desc, selfTime desc', content: 'duration:{ time: totalTime, total: #.data.totalTime }' },
          { header: 'Function', className: 'main', sorting: 'entry.name ascN', content: 'function-badge:entry' },
        ],
      },
    },
  },
}

const flamecharts = {
  view: 'context',
  modifiers: {
    view: 'block',
    className: 'toolbar',
    content: [
      {
        view: 'toggle-group',
        name: 'dataset',
        data: [
          { text: 'Categories', value: 'categoriesTree' },
          { text: 'Packages', value: 'packagesTree', active: true },
          { text: 'Modules', value: 'modulesTree' },
          { text: 'Functions', value: 'functionsTree' },
        ],
      },
      {
        view: 'block',
        className: 'filters',
        content: [
          // {
          //     view: 'checkbox',
          //     name: 'showIdle',
          //     checked: true,
          //     content: 'text:"(idle)"',
          //     tooltip: {
          //         showDelay: true,
          //         className: 'hint-tooltip',
          //         content: 'md:"Time when the engine is waiting for tasks or not actively executing any JavaScript code. This could be due to waiting for I/O operations, timer delays, or simply because there\'s no code to execute at that moment."'
          //     }
          // },
          // {
          //     view: 'checkbox',
          //     name: 'showProgram',
          //     checked: true,
          //     content: 'text:"(program)"',
          //     tooltip: {
          //         showDelay: true,
          //         className: 'hint-tooltip',
          //         content: 'text:"Time spent by the engine on tasks other than executing JavaScript code. This includes overheads like JIT compilation, managing execution contexts, and time in engine\'s internal code. It reflects the internal processing and environment setup necessary for running JavaScript code, rather than the execution of the code itself."'
          //     }
          // },
          // {
          //     view: 'checkbox',
          //     name: 'showGC',
          //     checked: true,
          //     content: 'text:"(garbage collector)"',
          //     tooltip: {
          //         showDelay: true,
          //         className: 'hint-tooltip',
          //         content: 'text:"When the CPU profile shows time spent in the garbage collector, it indicates the time consumed in these memory management activities. Frequent or prolonged garbage collection periods might be a sign of inefficient memory use in the application, like creating too many short-lived objects or holding onto unnecessary references."'
          //     }
          // }
        ],
      },
      {
        view: 'toggle',
        className: 'flamechart-fullpage-toggle',
        content: 'text:"Full page"',
        onToggle: () => toggleFullPageFlamechart(true),
      },
    ],
  },
  content: {
    view: 'flamechart',
    tree: '=$[#.dataset]',
    timings: '=$[#.dataset + "TimingsFiltered"]',
    lockScrolling: true,
    postRender(el, config, data, context) {
      el.classList.toggle('lock-scrolling', !context.params.flamechartFullpage)
    },
  },
}

const noDataPageContent = {
  view: 'block',
  className: 'welcome-page',
  content: [
    {
      view: 'page-header',
      content: [
        { view: 'block', className: 'logo' },
        'h1:"cpupro"',
        { view: 'block', className: 'description', content: 'text:"A viewer for CPU profiles captured in V8 runtimes like Node.js, Deno or Chromium browsers"' },
      ],
    },

    {
      view: 'block',
      when: '#.actions.uploadFile',
      className: 'upload-data',
      content: [
        'preset/upload',
        {
          view: 'block',
          className: 'upload-notes',
          content: 'html:"CPUpro is a server-less application that processes profiles locally without transmitting data elsewhere,<br>it securely opens and analyzes your profiles directly on your device."',
        },
      ],
    },

    {
      view: 'markdown',
      source: [
        'Supported formats:',
        ...supportedFormats,
      ],
    },

    {
      view: 'block',
      className: 'examples',
      when: '#.actions.demos',
      content: [
        'text:"Try out example:"',
        'html:"<br>"',
        {
          view: 'inline-list',
          data: '"demos".callAction()',
          whenData: true,
          item: {
            view: 'button',
            className: '=runtime',
            onClick(_, data) {
              discovery.loadDataFromUrl(data.url)
            },
            content: 'text:title',
          },
        },
      ],
    },
  ],
}

discovery.page.define('default', {
  view: 'switch',
  content: [
    {
      when: 'no #.datasets',
      content: noDataPageContent,
    },
    { content: [
      {
        view: 'page-header',
        content: [
          {
            view: 'h2',
            content: [
              { view: 'block', className: 'logo' },
              'text:#.datasets[].resource | type = "file" ? name : "Untitled profile"',
            ],
          },
        ],
      },

      pageIndicators,

      {
        view: 'timeline-profiles',
        data: 'profiles',
        whenData: true,
      },

      {
        view: 'expand',
        expanded: true,
        className: 'timelines trigger-outside',
        header: categoriesTimeBars,
        content: categoriesTimeline,
      },

      {
        view: 'expand',
        expanded: true,
        className: 'hierarchical-components trigger-outside',
        postRender: (el, config, data, context) =>
          el.style.setProperty('--total-time-digits', String(context.data.totalTime).replace(/\D/g, '').length - 2),
        header: [
          { view: 'block', content: [
            'text:"Packages "',
            {
              view: 'update-on-timings-change',
              data: 'packagesTimingsFiltered',
              content: 'text-numeric:entries.[totalTime].size()',
            },
          ] },
          { view: 'block', content: [
            'text:"Modules "',
            {
              view: 'update-on-timings-change',
              data: 'modulesTimingsFiltered',
              content: 'text-numeric:entries.[totalTime].size()',
            },
          ] },
          { view: 'block', content: [
            'text:"Functions "',
            {
              view: 'update-on-timings-change',
              data: 'functionsTimingsFiltered',
              content: 'text-numeric:entries.[totalTime].size()',
            },
          ] },
        ],
        content: [
          packagesList,
          modulesList,
          functionList,
        ],
      },

      {
        view: 'expand',
        expanded: true,
        className: 'flamecharts trigger-outside',
        header: 'text:"Flame charts"',
        content: flamecharts,
      },
    ] },
  ],
}, {
  init(pageEl) {
    pageEl.classList.toggle('flamecharts-fullpage', Boolean(discovery.pageParams.flamechartFullpage))
  },
})
