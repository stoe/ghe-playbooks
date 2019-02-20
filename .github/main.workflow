workflow "Lint Playbooks on Push" {
  on = "push"
  resolves = ["Lint License Mailer Playbook", "Lint Upgrade Playbook"]
}

action "Lint License Mailer Playbook" {
  uses = "ansible/ansible-lint/.github/action@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/license-mailer/playbook.yml"
  }
}

action "Lint Upgrade Playbook" {
  uses = "ansible/ansible-lint/.github/action@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/upgrade/playbook.yml"
  }
}
