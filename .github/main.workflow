workflow "Lint Playbooks on Push" {
  on = "push"
  resolves = ["Lint Upgrade Playbook", "Lint License Mailer Playbook"]
}

action "Lint Upgrade Playbook" {
  uses = "stoe/actions/ansible-lint@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/upgrade/playbook.yml"
  }
}

action "Lint License Mailer Playbook" {
  uses = "stoe/actions/ansible-lint@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/license-mailer/playbook.yml"
  }
}
