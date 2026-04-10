# Contributing to Simlanes

Thanks for helping improve sim rig recommendations! This guide explains how to submit changes.

## The easy version

All component data lives in **`_data/tiers.yml`**. You don't need to touch any HTML, CSS, or JavaScript. Just edit the YAML file and submit a pull request.

## How the data is structured

### Tiers (`_data/tiers.yml`)

Each tier is a YAML object:

```yaml
- name: "Tier Name"
  level: 3                          # Integer, determines ordering
  price_range: "$1,500 – $2,500"    # Approximate total cost
  use_cases: ["competitive", "endurance"]  # Tags from _data/use_cases.yml
  color: "#3b6fa0"                  # Hex color for the row accent
  description: "Short one-liner"
  components:
    wheelbase:
      name: "Product Name"
      price: "$300"
      notes: "Why this product at this tier. Keep it to 1-2 sentences."
    pedals:
      name: "Another Product"
      price: "$200"
      notes: "Explanation."
      bundled: true                 # Set if included with another component
```

### Categories (`_data/categories.yml`)

If you're adding a **new component category** (not just a product), add it here:

```yaml
- id: some_new_thing
  label: "Display Label"
  description: "What this category is"
  appears_at_tier: 3               # Lowest tier where it's relevant
```

### Use cases (`_data/use_cases.yml`)

Tags that can be assigned to tiers for filtering:

```yaml
- id: rally
  label: "Rally / Drift"
  description: "Dirt, gravel, and sideways"
```

## What makes a good contribution

- **Correct prices** — use current MSRP in USD. If a product goes on sale frequently, note that.
- **Honest recommendations** — no affiliate-driven picks. Recommend what you'd tell a friend.
- **Brief notes** — 1-2 sentences explaining *why* this product at this tier, not a full review.
- **Tier-appropriate** — a $2,000 wheelbase doesn't belong in the Starter tier.

## Submitting a PR

1. Fork the repo
2. Edit `_data/tiers.yml` (or other data files)
3. Test locally with `bundle exec jekyll serve` if you can (optional)
4. Submit a pull request with a clear title like "Update Club Racer pedals to Moza CRP V2"

## Testing locally

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000` in your browser.

## Questions?

Open an issue — we're happy to help.
