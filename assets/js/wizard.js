document.addEventListener('DOMContentLoaded', function () {
  var dataEl = document.getElementById('wizard-data');
  if (!dataEl) return;

  var data = JSON.parse(dataEl.textContent);
  var disciplines = data.disciplines;
  var tiers = data.tiers;

  var selectedDiscipline = null;
  var selectedTierLevel = null;

  var disciplineCards = document.querySelectorAll('.discipline-card');
  var budgetSection = document.getElementById('wizard-budget');
  var budgetBtns = document.querySelectorAll('.budget-btn');
  var resultPanel = document.getElementById('wizard-result');

  // --- Discipline selection ---
  disciplineCards.forEach(function (card) {
    card.addEventListener('click', function () {
      disciplineCards.forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
      selectedDiscipline = card.getAttribute('data-discipline');

      // Clear previous result and budget selection
      budgetBtns.forEach(function (b) { b.classList.remove('active'); });
      resultPanel.classList.remove('visible');
      resultPanel.innerHTML = '';
      selectedTierLevel = null;
      clearHighlight();
    });
  });

  // --- Budget selection ---
  budgetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      budgetBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedTierLevel = parseInt(btn.getAttribute('data-tier-level'), 10);

      if (selectedDiscipline && selectedTierLevel) {
        var result = assembleBuild(selectedDiscipline, selectedTierLevel);
        renderResult(result, false);
      }
    });
  });

  // --- Sync wizard result when user manually switches a flavor dropdown in the table ---
  var wizardDrivenChange = false;
  document.querySelectorAll('.flavor-select').forEach(function (select) {
    select.addEventListener('change', function () {
      if (wizardDrivenChange) return; // Ignore changes triggered by the wizard itself
      if (!selectedDiscipline || !selectedTierLevel) return;
      var group = select.getAttribute('data-flavor-group');
      if (group !== 'tier-' + selectedTierLevel) return;
      var flavorIndex = parseInt(select.value, 10);
      var result = assembleBuild(selectedDiscipline, selectedTierLevel, flavorIndex);
      renderResult(result, true);
    });
  });

  // --- Core: assemble a build ---
  // flavorOverride: optional integer index to force a specific flavor
  function assembleBuild(disciplineId, tierLevel, flavorOverride) {
    var discipline = disciplines.find(function (d) { return d.id === disciplineId; });
    var tier = tiers.find(function (t) { return t.level === tierLevel; });
    if (!discipline || !tier) return null;

    var disciplineRequires = discipline.requires;
    var bestFlavor = null;
    var components = null;

    if (tier.flavors) {
      if (typeof flavorOverride === 'number') {
        // Use the explicitly selected flavor
        var f = tier.flavors[flavorOverride];
        bestFlavor = { name: f.name, index: flavorOverride };
        components = f.components;
      } else {
        // Score each flavor against discipline requirements
        var bestScore = -1;
        tier.flavors.forEach(function (flavor, idx) {
          var provided = collectProvides(flavor.components);
          var score = scoreProvides(provided, disciplineRequires);
          if (score > bestScore) {
            bestScore = score;
            bestFlavor = { name: flavor.name, index: idx };
            components = flavor.components;
          }
        });
      }
    } else {
      components = tier.components;
    }

    // Merge discipline requirements with component-level requirements
    var requires = mergeRequires(disciplineRequires, components);

    var provided = collectProvides(components);
    var coverage = buildCoverage(provided, requires);

    // Find upgrade hints for gaps
    var gaps = coverage.filter(function (c) { return !c.satisfied; });
    var upgradeHints = [];
    gaps.forEach(function (gap) {
      for (var i = 0; i < tiers.length; i++) {
        var t = tiers[i];
        if (t.level <= tierLevel) continue;
        var comps = t.flavors ? t.flavors[0].components : t.components;
        var p = collectProvides(comps);
        if (p.indexOf(gap.capabilityId) !== -1) {
          upgradeHints.push({
            capability: gap.label,
            availableAt: t.name,
            priceRange: t.priceRange
          });
          break;
        }
      }
    });

    return {
      discipline: discipline,
      tier: tier,
      flavor: bestFlavor,
      components: components,
      coverage: coverage,
      gaps: gaps,
      upgradeHints: upgradeHints
    };
  }

  // --- Merge discipline requires with component-level requires ---
  // Component requires are always treated as "required" level.
  // If the discipline already has that capability at any level, the higher
  // priority wins (required > recommended > optional).
  function mergeRequires(disciplineRequires, components) {
    var merged = {};
    for (var cap in disciplineRequires) {
      merged[cap] = disciplineRequires[cap];
    }
    for (var key in components) {
      var comp = components[key];
      if (comp && comp.requires) {
        comp.requires.forEach(function (r) {
          if (!merged[r] || merged[r] !== 'required') {
            merged[r] = 'required';
          }
        });
      }
    }
    return merged;
  }

  // --- Collect all provides from a components map ---
  function collectProvides(components) {
    var provided = [];
    for (var key in components) {
      var comp = components[key];
      if (comp && comp.provides) {
        comp.provides.forEach(function (p) {
          if (provided.indexOf(p) === -1) provided.push(p);
        });
      }
    }
    return provided;
  }

  // --- Score a provides set against requirements ---
  function scoreProvides(provided, requires) {
    var score = 0;
    for (var cap in requires) {
      if (provided.indexOf(cap) !== -1) {
        if (requires[cap] === 'required') score += 10;
        else if (requires[cap] === 'recommended') score += 5;
        else score += 1;
      }
    }
    return score;
  }

  // --- Build coverage report ---
  function buildCoverage(provided, requires) {
    var report = [];
    for (var cap in requires) {
      var level = requires[cap];
      var capData = data.capabilities.find(function (c) { return c.id === cap; });
      report.push({
        capabilityId: cap,
        label: capData ? capData.label : cap,
        level: level,
        satisfied: provided.indexOf(cap) !== -1
      });
    }
    // Sort: required first, then recommended, then optional.
    // Within each level, satisfied items before gaps.
    var order = { required: 1, recommended: 2, optional: 3 };
    report.sort(function (a, b) {
      var levelDiff = (order[a.level] || 4) - (order[b.level] || 4);
      if (levelDiff !== 0) return levelDiff;
      return (a.satisfied ? 0 : 1) - (b.satisfied ? 0 : 1);
    });
    return report;
  }

  // --- Render the result panel ---
  function renderResult(result, skipScroll) {
    if (!result) {
      resultPanel.innerHTML = '';
      resultPanel.classList.remove('visible');
      return;
    }

    var html = '';
    html += '<div class="wizard-result-header">';
    html += '<h3 class="wizard-result-title">' + result.discipline.label + ' at ' + result.tier.name + '</h3>';
    html += '<span class="wizard-result-price">' + result.tier.priceRange + '</span>';
    if (result.flavor) {
      html += '<span class="wizard-result-flavor">Chosen flavor: ' + result.flavor.name + '</span>';
    }
    html += '</div>';

    // Coverage report
    html += '<div class="wizard-coverage">';
    html += '<h4 class="wizard-coverage-title">Capability Coverage</h4>';
    result.coverage.forEach(function (item) {
      var icon = item.satisfied ? '&#10003;' : '&#10007;';
      var cls = item.satisfied ? 'satisfied' : 'gap';
      html += '<div class="wizard-cap ' + cls + ' ' + item.level + '">';
      html += '<span class="wizard-cap-icon">' + icon + '</span>';
      html += '<span class="wizard-cap-label">' + item.label + '</span>';
      html += '<span class="wizard-cap-level">' + item.level + '</span>';
      html += '</div>';
    });
    html += '</div>';

    // Component list
    html += '<div class="wizard-components">';
    html += '<h4 class="wizard-components-title">Recommended Components</h4>';
    for (var key in result.components) {
      var comp = result.components[key];
      if (!comp) continue;
      html += '<div class="wizard-comp">';
      html += '<span class="wizard-comp-cat">' + key.replace(/_/g, ' ') + '</span>';
      html += '<span class="wizard-comp-name">' + comp.name + '</span>';
      html += '<span class="wizard-comp-price">' + comp.price + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Upgrade hints
    if (result.upgradeHints.length > 0) {
      html += '<div class="wizard-upgrades">';
      html += '<h4 class="wizard-upgrades-title">To fill gaps, consider</h4>';
      result.upgradeHints.forEach(function (hint) {
        html += '<div class="wizard-upgrade">';
        html += '<span class="wizard-upgrade-cap">' + hint.capability + '</span>';
        html += ' available at <strong>' + hint.availableAt + '</strong>';
        html += ' (' + hint.priceRange + ')';
        html += '</div>';
      });
      html += '</div>';
    }

    resultPanel.innerHTML = html;
    resultPanel.classList.add('visible');

    if (!skipScroll) {
      // Scroll to result panel first so user sees the coverage report
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Highlight tier row in table and switch flavor (no scroll)
    highlightTier(result.tier.level, result.flavor);
  }

  // --- Highlight the matching tier row in the table ---
  function highlightTier(level, flavor) {
    clearHighlight();

    // If flavored, switch the dropdown first
    if (flavor) {
      wizardDrivenChange = true;
      var selects = document.querySelectorAll('.flavor-select[data-flavor-group="tier-' + level + '"]');
      selects.forEach(function (sel) {
        sel.value = flavor.index;
        sel.dispatchEvent(new Event('change'));
      });
      wizardDrivenChange = false;
    }

    var row = document.querySelector('.tier-row[data-level="' + level + '"]:not(.flavor-hidden)');
    if (row) {
      row.classList.add('wizard-highlighted');
    }
  }

  function clearHighlight() {
    document.querySelectorAll('.wizard-highlighted').forEach(function (el) {
      el.classList.remove('wizard-highlighted');
    });
  }
});
