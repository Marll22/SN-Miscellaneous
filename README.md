# ServiceNow

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![license-shield]][license-url]

## About The Project

In this project you will find some of my scripts, update sets, cheatsheets, and whatever related to ServiceNow I may find interesting at some point.

## Update Sets

| Name | Description |
| -- | -- |
| [Code review](./update-sets/code_review.xml) | Code review utility created by David Martin Clavo. Allows you to review the contain of an update set |
| [Underscore JS](./update-sets/underscore_js.xml) | UnderscoreJS library included as a script include |
| [Fixed query](./update-sets/fixed_query.xml) | Fixed query example |
| [Generic API](./update-sets/generic_api.xml) | Generic API implementation |
| [Reference field. Auto-complete](./update-sets/reference_field_auto_complete.xml) | Demo of https://snprotips.com/blog/2016/2/22/referencelist-attributes |
| [Adobe Embed API](./update-sets/adobe_embed_api.xml) | Demo of Adobe Embed API embedded in a widget |


### Scripts

| Name | Description | Application | Scope |
| -- | -- | -- | -- |
| [`user_node.js`](./scripts/user_node.js) | Returns the node which a user is logged-in to | Platform | Global |
| [`stuck_event.js`](./scripts/stuck_event.js) | Returns events claimed by nodes which are not running in the instance anymore | Platform | Global |
| [`ppm_duplicated_capacity.js`](./scripts/ppm_duplicated_capacity.js) | Fix/print resource users with duplicated records in aggregate tables | PPM | Global |

### Other

| Name | Description |
| -- | -- |
| [`doc.py`](./other/doc.py) | Utility for parsing update sets (`update_set.xml`) and create a Markdown file containing information aoput the update set and the manual actions |
| [`text_formatter.js`](./other/text_formatter.js) | Save as a browser bookmark, enhance the *Additional Comments* field including format |

### Docs

* [Anchor Tag - ng-click()](.docs/anchor_ng_click.md)
* [How to attach a file to a mail by script](./docs/attach_file_mail.md)
* [How to fake a workflow event](./docs/fake_workflow_event.md)
* [How to sort a grouped list view](./docs/sort_grouped_list_view.md)
* [MID Server Troubleshooting](./docs/mid_server_troubleshooting.md)
* [Opened for / Subject person](.docs/opened_for_subject_person.md)
* [ServiceNow UI Developer Cheatsheet](./docs/ui_cheatsheet.md)
* [Underscore library snippets](./docs/underscore_library.md)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

See `LICENSE` for more information.

## Contact

* [alexalvarez.es](https://www.alexalvarez.es)

* [alexalvarez@mail.com](mailto:alexalvarez@mail.com)

[contributors-shield]: https://img.shields.io/github/contributors/AlexAlvarez092/servicenow.svg?style=for-the-badge
[contributors-url]: https://github.com/AlexAlvarez092/servicenow/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/AlexAlvarez092/servicenow.svg?style=for-the-badge
[forks-url]: https://github.com/AlexAlvarez092/servicenow/network/members

[stars-shield]: https://img.shields.io/github/stars/AlexAlvarez092/servicenow.svg?style=for-the-badge
[stars-url]: https://github.com/gAlexAlvarez092/servicenow/stargazers

[issues-shield]: https://img.shields.io/github/issues/AlexAlvarez092/servicenow.svg?style=for-the-badge
[issues-url]: https://github.com/AlexAlvarez092/servicenow/issues

[license-shield]: https://img.shields.io/github/license/AlexAlvarez092/servicenow.svg?style=for-the-badge
[license-url]: https://github.com/AlexAlvarez092/servicenow/blob/master/LICENSE.txt
