import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';


export class AnotherGraph {
    public ticker: EventEmitter<d3.ClusterLayout<Node>> = new EventEmitter();
    public cluster: d3.ClusterLayout<any>;

    public nodes: Node[] = [];
    public links: Link[] = [];

    constructor(nodes, links, options: { width, height }) {
        this.nodes = nodes;
        this.links = links;

        this.initSimulation(options);
    }

    initNodes() {
        if (!this.cluster) {
            throw new Error('simulation was not initialized yet');
        }
    }

    initLinks() {
        if (!this.cluster) {
            throw new Error('simulation was not initialized yet');
        }
    }

    initSimulation(options) {
        if (!options || !options.width || !options.height) {
            throw new Error('missing options when initializing simulation');
        }

        /** Creating the simulation */
        if (!this.cluster) {
            this.cluster = d3.cluster();
            this.initNodes();
            this.initLinks();
        }
    }


    build() {
        var diameter = 960,radius = diameter / 2, innerRadius = radius - 120;
        var cluster = d3.cluster().size([360, innerRadius]);
        var line = d3
            .radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius((d) => { return d[1]; })
            .angle((d) => { return d[0] / 180 * Math.PI; });
        var svg = d3
            .select("body")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var link = svg.append("g").selectAll(".link"), node = svg.append("g").selectAll(".node");

        d3.json("flare.json");
        // .then((value) => {
        //     if (value.error) throw value.error;
        //     var root = this.packageHierarchy(value.classes)
        //         .sum(function(d) { return d.size; });
        //     cluster(root);
        //     link = link
        //       .data(this.packageImports(root.leaves()))
        //       .enter().append("path")
        //         .each((d) => { d.source = d[0], d.target = d[d.length - 1]; })
        //         .attr("class", "link")
        //         .attr("d", line);
        //     node = node
        //       .data(root.leaves())
        //       .enter().append("text")
        //         .attr("class", "node")
        //         .attr("dy", "0.31em")
        //         .attr("transform", (d) => { return "rotate(" + (d[0] - 90) + ")translate(" + (d[1] + 8) + ",0)" + (d[0] < 180 ? "" : "rotate(180)"); })
        //         .attr("text-anchor", (d) => { return d[0] < 180 ? "start" : "end"; })
        //         .text((d) => { return d.data.key; });
        //   });
    }
    // Lazily construct the package hierarchy from class names.
packageHierarchy(classes) {
    var map = {};
    function find(name, data) {
      var node = map[name], i;
      if (!node) {
        node = map[name] = data || {name: name, children: []};
        if (name.length) {
        //   node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }
    classes.forEach(function(d) {
      find(d.name, d);
    });
    return d3.hierarchy(map[""]);
  }

  // Return a list of imports for the given array of nodes.
  packageImports(nodes) {
    var map = {},
        imports = [];
    // Compute a map from name to node.
    nodes.forEach(function(d) {
      map[d.data.name] = d;
    });
    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
      if (d.data.imports) d.data.imports.forEach(function(i) {
        imports.push(map[d.data.name].path(map[i]));
      });
    });
    return imports;
  }
}
